import { controlObrasService } from "./controlObras.service";
import {
  InformeSemanalDto,
  PlanSemanalDto,
  ProyeccionDto,
  ReporteDiarioDto
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

export interface ProyeccionTraceabilityData {
  proyeccion: ProyeccionDto | null;
  planesSemanales: PlanSemanalDto[];
  reportesDiarios: ReporteDiarioDto[];
  informesSemanales: InformeSemanalDto[];
}

export const proyeccionTraceabilityService = {
  async getByProyeccion(
    proyeccionKey: string
  ): Promise<ProyeccionTraceabilityData> {
    const [
      proyecciones,
      planesSemanales,
      reportesDiarios,
      informesSemanales
    ] = await Promise.all([
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
        controlObrasService.informesSemanales.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      )
    ]);

    const proyeccion =
      proyecciones.find(row =>
        sameKey(row.orsIdentifkeyPsem, proyeccionKey)
      ) ?? null;

    const planesSemanalesProyeccion = planesSemanales.filter(row =>
      sameKey(row.orsIdentifkeyPsem, proyeccionKey)
    );

    const reportesDiariosProyeccion = reportesDiarios.filter(row =>
      sameKey(row.orsIdentifkeyPsem, proyeccionKey)
    );

    const informesSemanalesProyeccion = informesSemanales.filter(row =>
      sameKey(row.orsIdentifkeyPsem, proyeccionKey)
    );

    return {
      proyeccion,
      planesSemanales: planesSemanalesProyeccion,
      reportesDiarios: reportesDiariosProyeccion,
      informesSemanales: informesSemanalesProyeccion
    };
  }
};