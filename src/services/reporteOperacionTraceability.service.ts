import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  DetalleEquipoOperacionDto,
  ReporteOperacionDto
} from "../types/controlObras.types";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto
} from "../types/evidencias.types";

function sameKey(value?: string, key?: string) {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase() ===
    String(key ?? "")
      .trim()
      .toLowerCase()
  );
}

async function getPageData<T>(
  loader: () => Promise<{ rspData?: T[] }>
): Promise<T[]> {
  try {
    const response = await loader();
    return (response.rspData ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

export interface ReporteOperacionTraceabilityData {
  reporteOperacion: ReporteOperacionDto | null;
  detallesEquipos: DetalleEquipoOperacionDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const reporteOperacionTraceabilityService = {
  async getByReporteOperacion(
    reporteOperacionKey: string
  ): Promise<ReporteOperacionTraceabilityData> {
    const [reportesOperacion, detallesEquipos, referencias, evidencias] =
      await Promise.all([
        getPageData(() =>
          controlObrasService.reportesOperacion.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        ),

        getPageData(() =>
          controlObrasService.detallesEquiposOperacion.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        ),

        getPageData(() =>
          evidenciasService.referencias.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        ),

        getPageData(() =>
          evidenciasService.evidencias.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        )
      ]);

    const reporteOperacion =
      reportesOperacion.find(row =>
        sameKey(row.orsIdentifkeyRope, reporteOperacionKey)
      ) ?? null;

    const detallesReporte = detallesEquipos.filter(row =>
      sameKey(row.orsIdentifkeyRope, reporteOperacionKey)
    );

    const detalleKeys = detallesReporte
      .map(row => row.orsIdentifkeyDeop)
      .filter(Boolean);

    const referenciasReporte = referencias.filter(row => {
      const registroRelacionado = row.eviIdentifregistroRefe;

      return (
        sameKey(registroRelacionado, reporteOperacionKey) ||
        detalleKeys.some(key => sameKey(registroRelacionado, key))
      );
    });

    const evidenciaKeys = referenciasReporte
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasReporte = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      reporteOperacion,
      detallesEquipos: detallesReporte,
      referencias: referenciasReporte,
      evidencias: evidenciasReporte
    };
  }
};