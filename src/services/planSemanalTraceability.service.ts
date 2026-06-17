import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  InformeSemanalDto,
  NovedadDto,
  PlanSemanalDto,
  ReporteDiarioDto
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

function isNovedadFromPlanSemanal(row: NovedadDto, planSemanalKey: string) {
  return (
    sameKey(row.orsRegistbaseNove, planSemanalKey) ||
    sameKey(row.orsRegistrbaseNove, planSemanalKey)
  );
}

export interface PlanSemanalTraceabilityData {
  planSemanal: PlanSemanalDto | null;
  reportesDiarios: ReporteDiarioDto[];
  novedades: NovedadDto[];
  informesSemanales: InformeSemanalDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const planSemanalTraceabilityService = {
  async getByPlanSemanal(
    planSemanalKey: string
  ): Promise<PlanSemanalTraceabilityData> {
    const [
      planesSemanales,
      reportesDiarios,
      novedades,
      informesSemanales,
      referencias,
      evidencias
    ] = await Promise.all([
      getPageData(() =>
        controlObrasService.planesSemanales.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

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
        controlObrasService.informesSemanales.getPages({
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

    const planSemanal =
      planesSemanales.find(row =>
        sameKey(row.orsIdentifkeyPlse, planSemanalKey)
      ) ?? null;

    const reportesPlanSemanal = reportesDiarios.filter(row =>
      sameKey(row.orsIdentifkeyPlse, planSemanalKey)
    );

    const novedadesPlanSemanal = novedades.filter(row =>
      isNovedadFromPlanSemanal(row, planSemanalKey)
    );

    const informesPlanSemanal = informesSemanales.filter(row =>
      sameKey(row.orsIdentifkeyPlse, planSemanalKey)
    );

    const referenciasPlanSemanal = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, planSemanalKey)
    );

    const evidenciaKeys = referenciasPlanSemanal
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasPlanSemanal = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      planSemanal,
      reportesDiarios: reportesPlanSemanal,
      novedades: novedadesPlanSemanal,
      informesSemanales: informesPlanSemanal,
      referencias: referenciasPlanSemanal,
      evidencias: evidenciasPlanSemanal
    };
  }
};