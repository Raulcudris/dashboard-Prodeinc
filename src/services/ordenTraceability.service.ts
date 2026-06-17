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
  return String(value ?? "").trim().toLowerCase() === String(key ?? "").trim().toLowerCase();
}

function onlyByOrden<T extends { orsIdentifkeyOrde?: string }>(
  rows: T[] | undefined,
  ordenKey: string
) {
  return (rows ?? []).filter(Boolean).filter(row =>
    sameKey(row.orsIdentifkeyOrde, ordenKey)
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
      ordenes,
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
      getPageData(() =>
        controlObrasService.ordenes.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        controlObrasService.sitios.getPages({
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
        controlObrasService.resumenEquipos.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        controlObrasService.actasModificacion.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getAvanceOrden(ordenKey)
    ]);

    const orden =
      ordenes.find(row => sameKey(row.orsIdentifkeyOrde, ordenKey)) ?? null;

    return {
      orden,
      sitios: onlyByOrden(sitios, ordenKey),
      proyecciones: onlyByOrden(proyecciones, ordenKey),
      planes: onlyByOrden(planes, ordenKey),
      planesSemanales: onlyByOrden(planesSemanales, ordenKey),
      reportesDiarios: onlyByOrden(reportesDiarios, ordenKey),
      novedades: onlyByOrden(novedades, ordenKey),
      resumenEquipos: onlyByOrden(resumenEquipos, ordenKey),
      actasModificacion: onlyByOrden(actasModificacion, ordenKey),
      avance
    };
  }
};