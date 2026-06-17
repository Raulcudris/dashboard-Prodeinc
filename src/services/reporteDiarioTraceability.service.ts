import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  NovedadDto,
  ReporteDiarioDto
} from "../types/controlObras.types";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto
} from "../types/evidencias.types";

function sameKey(value?: string, key?: string) {
  return String(value ?? "").trim().toLowerCase() === String(key ?? "").trim().toLowerCase();
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

function isNovedadFromReporte(row: NovedadDto, reporteDiarioKey: string) {
  return (
    sameKey(row.orsRegistbaseNove, reporteDiarioKey) ||
    sameKey(row.orsRegistrbaseNove, reporteDiarioKey)
  );
}

function isReferenciaFromReporte(
  row: ReferenciaEvidenciaDto,
  reporteDiarioKey: string
) {
  return (
    sameKey(row.eviIdentifregistroRefe, reporteDiarioKey) ||
    sameKey(row.eviTiporegistroRefe, "REPORTE_DIARIO") ||
    sameKey(row.eviTiporegistroRefe, "REPORTE_OPERACION")
  );
}

export interface ReporteDiarioTraceabilityData {
  reporte: ReporteDiarioDto | null;
  novedades: NovedadDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const reporteDiarioTraceabilityService = {
  async getByReporte(
    reporteDiarioKey: string
  ): Promise<ReporteDiarioTraceabilityData> {
    const [reportesDiarios, novedades, referencias, evidencias] =
      await Promise.all([
        getPageData(() =>
          controlObrasService.reportesDiarios.getPages({
            currentPage: 1,
            pageSize: 500,
            parameter: "TEXT",
            filter: ""
          })
        ),

        getPageData(() =>
          controlObrasService.novedades.getPages({
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

    const reporte =
      reportesDiarios.find(row =>
        sameKey(row.orsIdentifkeyPdia, reporteDiarioKey)
      ) ?? null;

    const novedadesReporte = novedades.filter(row =>
      isNovedadFromReporte(row, reporteDiarioKey)
    );

    const referenciasReporte = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, reporteDiarioKey)
    );

    const evidenciaKeys = referenciasReporte
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasReporte = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      reporte,
      novedades: novedadesReporte,
      referencias: referenciasReporte,
      evidencias: evidenciasReporte
    };
  }
};