import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  NovedadDto,
  PlanSemanalDto,
  PlanTrabajoDto,
  ReporteDiarioDto,
  SitioPuntoDto
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

function isNovedadFromSitio(row: NovedadDto, sitioKey: string) {
  return (
    sameKey(row.orsRegistbaseNove, sitioKey) ||
    sameKey(row.orsRegistrbaseNove, sitioKey)
  );
}

export interface SitioTraceabilityData {
  sitio: SitioPuntoDto | null;
  planesTrabajo: PlanTrabajoDto[];
  planesSemanales: PlanSemanalDto[];
  reportesDiarios: ReporteDiarioDto[];
  novedades: NovedadDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const sitioTraceabilityService = {
  async getBySitio(sitioKey: string): Promise<SitioTraceabilityData> {
    const [
      sitios,
      planesTrabajo,
      planesSemanales,
      reportesDiarios,
      novedades,
      referencias,
      evidencias
    ] = await Promise.all([
      getPageData(() =>
        controlObrasService.sitios.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

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

    const sitio =
      sitios.find(row => sameKey(row.orsIdentifkeyPunt, sitioKey)) ?? null;

    const planesSitio = planesTrabajo.filter(row =>
      sameKey(row.orsIdentifkeyPunt, sitioKey)
    );

    const planTrabajoKeys = planesSitio
      .map(row => row.orsIdentifkeyPltr)
      .filter(Boolean);

    const planesSemanalesSitio = planesSemanales.filter(row =>
      planTrabajoKeys.some(key => sameKey(row.orsIdentifkeyPltr, key))
    );

    const planSemanalKeys = planesSemanalesSitio
      .map(row => row.orsIdentifkeyPlse)
      .filter(Boolean);

    const reportesSitio = reportesDiarios.filter(row =>
      planSemanalKeys.some(key => sameKey(row.orsIdentifkeyPlse, key))
    );

    const novedadesSitio = novedades.filter(row =>
      isNovedadFromSitio(row, sitioKey)
    );

    const referenciasSitio = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, sitioKey)
    );

    const evidenciaKeys = referenciasSitio
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasSitio = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      sitio,
      planesTrabajo: planesSitio,
      planesSemanales: planesSemanalesSitio,
      reportesDiarios: reportesSitio,
      novedades: novedadesSitio,
      referencias: referenciasSitio,
      evidencias: evidenciasSitio
    };
  }
};