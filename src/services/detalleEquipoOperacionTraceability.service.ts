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

export interface DetalleEquipoOperacionTraceabilityData {
  detalleEquipo: DetalleEquipoOperacionDto | null;
  reporteOperacion: ReporteOperacionDto | null;
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const detalleEquipoOperacionTraceabilityService = {
  async getByDetalleEquipoOperacion(
    detalleEquipoOperacionKey: string
  ): Promise<DetalleEquipoOperacionTraceabilityData> {
    const [detallesEquipos, reportesOperacion, referencias, evidencias] =
      await Promise.all([
        getPageData(() =>
          controlObrasService.detallesEquiposOperacion.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        ),

        getPageData(() =>
          controlObrasService.reportesOperacion.getPages({
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

    const detalleEquipo =
      detallesEquipos.find(row =>
        sameKey(row.orsIdentifkeyDeop, detalleEquipoOperacionKey)
      ) ?? null;

    const reporteOperacion =
      reportesOperacion.find(row =>
        sameKey(row.orsIdentifkeyRope, detalleEquipo?.orsIdentifkeyRope)
      ) ?? null;

    const referenciasDetalle = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, detalleEquipoOperacionKey)
    );

    const evidenciaKeys = referenciasDetalle
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasDetalle = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      detalleEquipo,
      reporteOperacion,
      referencias: referenciasDetalle,
      evidencias: evidenciasDetalle
    };
  }
};