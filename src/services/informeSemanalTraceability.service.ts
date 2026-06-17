import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  InformeSemanalDto,
  PlanSemanalDto,
  ProyeccionDto,
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

export interface InformeSemanalTraceabilityData {
  informeSemanal: InformeSemanalDto | null;
  proyeccionSemanal: ProyeccionDto | null;
  planSemanal: PlanSemanalDto | null;
  reportesDiarios: ReporteDiarioDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const informeSemanalTraceabilityService = {
  async getByInformeSemanal(
    informeSemanalKey: string
  ): Promise<InformeSemanalTraceabilityData> {
    const [
      informesSemanales,
      proyeccionesSemanales,
      planesSemanales,
      reportesDiarios,
      referencias,
      evidencias
    ] = await Promise.all([
      getPageData(() =>
        controlObrasService.informesSemanales.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        controlObrasService.proyeccionSemanal.getPages({
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

    const informeSemanal =
      informesSemanales.find(row =>
        sameKey(row.orsIdentifkeyInse, informeSemanalKey)
      ) ?? null;

    const proyeccionSemanal =
      proyeccionesSemanales.find(row =>
        sameKey(row.orsIdentifkeyPsem, informeSemanal?.orsIdentifkeyPsem)
      ) ?? null;

    const planSemanal =
      planesSemanales.find(row =>
        sameKey(row.orsIdentifkeyPlse, informeSemanal?.orsIdentifkeyPlse)
      ) ?? null;

    const reportesInforme = reportesDiarios.filter(row => {
      const samePlanSemanal = sameKey(
        row.orsIdentifkeyPlse,
        informeSemanal?.orsIdentifkeyPlse
      );

      const sameProyeccion = sameKey(
        row.orsIdentifkeyPsem,
        informeSemanal?.orsIdentifkeyPsem
      );

      return samePlanSemanal || sameProyeccion;
    });

    const referenciasInforme = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, informeSemanalKey)
    );

    const evidenciaKeys = referenciasInforme
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasInforme = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      informeSemanal,
      proyeccionSemanal,
      planSemanal,
      reportesDiarios: reportesInforme,
      referencias: referenciasInforme,
      evidencias: evidenciasInforme
    };
  }
};