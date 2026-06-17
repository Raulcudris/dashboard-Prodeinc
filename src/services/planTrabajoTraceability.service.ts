import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  NovedadDto,
  PlanSemanalDto,
  PlanTrabajoDto,
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

function isNovedadFromPlanTrabajo(row: NovedadDto, planTrabajoKey: string) {
  return (
    sameKey(row.orsRegistbaseNove, planTrabajoKey) ||
    sameKey(row.orsRegistrbaseNove, planTrabajoKey)
  );
}

export interface PlanTrabajoTraceabilityData {
  planTrabajo: PlanTrabajoDto | null;
  planesSemanales: PlanSemanalDto[];
  reportesDiarios: ReporteDiarioDto[];
  novedades: NovedadDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const planTrabajoTraceabilityService = {
  async getByPlanTrabajo(
    planTrabajoKey: string
  ): Promise<PlanTrabajoTraceabilityData> {
    const [
      planesTrabajo,
      planesSemanales,
      reportesDiarios,
      novedades,
      referencias,
      evidencias
    ] = await Promise.all([
      getPageData(() =>
        controlObrasService.planes.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

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

    const planTrabajo =
      planesTrabajo.find(row =>
        sameKey(row.orsIdentifkeyPltr, planTrabajoKey)
      ) ?? null;

    const planesSemanalesPlan = planesSemanales.filter(row =>
      sameKey(row.orsIdentifkeyPltr, planTrabajoKey)
    );

    const planSemanalKeys = planesSemanalesPlan
      .map(row => row.orsIdentifkeyPlse)
      .filter(Boolean);

    const reportesPlan = reportesDiarios.filter(row =>
      planSemanalKeys.some(key => sameKey(row.orsIdentifkeyPlse, key))
    );

    const novedadesPlan = novedades.filter(row =>
      isNovedadFromPlanTrabajo(row, planTrabajoKey)
    );

    const referenciasPlan = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, planTrabajoKey)
    );

    const evidenciaKeys = referenciasPlan
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasPlan = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      planTrabajo,
      planesSemanales: planesSemanalesPlan,
      reportesDiarios: reportesPlan,
      novedades: novedadesPlan,
      referencias: referenciasPlan,
      evidencias: evidenciasPlan
    };
  }
};