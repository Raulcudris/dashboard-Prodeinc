import { controlObrasService } from "./controlObras.service";
import {
  ActaModificacionDto,
  AvanceObraDto,
  NovedadDto,
  OrdenServicioDto,
  PlanSemanalDto,
  PlanTrabajoDto,
  ProyeccionDto,
  ReporteDiarioDto,
  ResumenEquipoDto,
  SitioPuntoDto
} from "../types/controlObras.types";

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

async function getOrdenByKey(ordenKey: string): Promise<OrdenServicioDto | null> {
  try {
    const response = await controlObrasService.ordenes.getPages({
      currentPage: 1,
      pageSize: 500,
      parameter: "TEXT",
      filter: ""
    });

    const ordenes = (response.rspData ?? []).filter(Boolean);

    return (
      ordenes.find(row => sameKey(row.orsIdentifkeyOrde, ordenKey)) ?? null
    );
  } catch {
    return null;
  }
}

async function getSitiosByOrden(ordenKey: string): Promise<SitioPuntoDto[]> {
  return getPageData(() => controlObrasService.sitios.getByOrden(ordenKey));
}

async function getProyeccionesByOrden(
  ordenKey: string
): Promise<ProyeccionDto[]> {
  return getPageData(() =>
    controlObrasService.proyeccionSemanal.getByOrden(ordenKey)
  );
}

async function getPlanesByOrden(ordenKey: string): Promise<PlanTrabajoDto[]> {
  return getPageData(() => controlObrasService.planes.getByOrden(ordenKey));
}

async function getPlanesSemanalesByOrden(
  ordenKey: string
): Promise<PlanSemanalDto[]> {
  return getPageData(() =>
    controlObrasService.planesSemanales.getByOrden(ordenKey)
  );
}

async function getReportesDiariosByOrden(
  ordenKey: string
): Promise<ReporteDiarioDto[]> {
  return getPageData(() =>
    controlObrasService.reportesDiarios.getByOrden(ordenKey)
  );
}

async function getNovedadesByOrden(ordenKey: string): Promise<NovedadDto[]> {
  return getPageData(() => controlObrasService.novedades.getByOrden(ordenKey));
}

async function getResumenEquiposByOrden(
  ordenKey: string
): Promise<ResumenEquipoDto[]> {
  return getPageData(() =>
    controlObrasService.resumenEquipos.getByOrden(ordenKey)
  );
}

async function getActasModificacionByOrden(
  ordenKey: string
): Promise<ActaModificacionDto[]> {
  return getPageData(() =>
    controlObrasService.actasModificacion.getByOrden(ordenKey)
  );
}

async function getAvanceOrden(ordenKey: string): Promise<AvanceObraDto[]> {
  try {
    const response = await controlObrasService.avances.getOrdenConsolidado(
      ordenKey
    );

    return (response.rspData ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

export interface OrdenTraceabilityData {
  orden: OrdenServicioDto | null;
  sitios: SitioPuntoDto[];
  proyecciones: ProyeccionDto[];
  planes: PlanTrabajoDto[];
  planesSemanales: PlanSemanalDto[];
  reportesDiarios: ReporteDiarioDto[];
  novedades: NovedadDto[];
  resumenEquipos: ResumenEquipoDto[];
  actasModificacion: ActaModificacionDto[];
  avance: AvanceObraDto[];
}

export const ordenTraceabilityService = {
  async getByOrden(ordenKey: string): Promise<OrdenTraceabilityData> {
    const [
      orden,
      sitios,
      proyecciones,
      planes,
      planesSemanales,
      reportesDiarios,
      novedades,
      resumenEquipos,
      actasModificacion,
      avance
    ] = await Promise.all([
      getOrdenByKey(ordenKey),
      getSitiosByOrden(ordenKey),
      getProyeccionesByOrden(ordenKey),
      getPlanesByOrden(ordenKey),
      getPlanesSemanalesByOrden(ordenKey),
      getReportesDiariosByOrden(ordenKey),
      getNovedadesByOrden(ordenKey),
      getResumenEquiposByOrden(ordenKey),
      getActasModificacionByOrden(ordenKey),
      getAvanceOrden(ordenKey)
    ]);

    return {
      orden,
      sitios,
      proyecciones,
      planes,
      planesSemanales,
      reportesDiarios,
      novedades,
      resumenEquipos,
      actasModificacion,
      avance
    };
  }
};