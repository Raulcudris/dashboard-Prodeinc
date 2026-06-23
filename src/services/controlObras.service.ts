import { ApiResponse } from "../types/common.types";
import {
  ActaModificacionDetalleDto,
  ActaModificacionDto,
  AvanceObraDto,
  DetalleEquipoOperacionDto,
  InformeSemanalDto,
  NovedadDto,
  OrdenServicioDto,
  PlanSemanalDto,
  PlanTrabajoDto,
  ProyeccionDto,
  ReporteDiarioDto,
  ReporteOperacionDto,
  ResumenEquipoDto,
  SitioPuntoDto
} from "../types/controlObras.types";
import { http } from "./apiClient";
import { createCrudService } from "./crud.service";

const BASE_CONTROL = "/api/control-obras";

const BASE_ORDENES = `${BASE_CONTROL}/ordenes`;
const BASE_SITIOS = `${BASE_CONTROL}/sitios`;
const BASE_PROYECCION = `${BASE_CONTROL}/proyeccion-semanal`;
const BASE_PLANES = `${BASE_CONTROL}/planes`;
const BASE_PLANES_SEMANALES = `${BASE_CONTROL}/planes-semanales`;
const BASE_REPORTES_DIARIOS = `${BASE_CONTROL}/reportes-diarios`;
const BASE_RESUMEN_EQUIPOS = `${BASE_CONTROL}/resumen-equipos`;
const BASE_REPORTES_OPERACION = `${BASE_CONTROL}/reportes-operacion`;
const BASE_DETALLES_EQUIPOS = `${BASE_CONTROL}/detalles-equipos-operacion`;
const BASE_NOVEDADES = `${BASE_CONTROL}/novedades`;
const BASE_AVANCES = `${BASE_CONTROL}/avances`;
const BASE_INFORMES = `${BASE_CONTROL}/informes-semanales`;
const BASE_ACTAS = `${BASE_CONTROL}/actas-modificacion`;
const BASE_ACTAS_DETALLES = `${BASE_CONTROL}/actas-modificacion-detalles`;

const ordenesCrud = createCrudService<OrdenServicioDto>(
  BASE_ORDENES,
  "ordenKey"
);

const sitiosCrud = createCrudService<SitioPuntoDto>(
  BASE_SITIOS,
  "sitioKey"
);

const proyeccionSemanalCrud = createCrudService<ProyeccionDto>(
  BASE_PROYECCION,
  "proyeccionSemanalKey"
);

const planesCrud = createCrudService<PlanTrabajoDto>(
  BASE_PLANES,
  "planKey"
);

const planesSemanalesCrud = createCrudService<PlanSemanalDto>(
  BASE_PLANES_SEMANALES,
  "planSemanalKey"
);

const reportesDiariosCrud = createCrudService<ReporteDiarioDto>(
  BASE_REPORTES_DIARIOS,
  "reporteDiarioKey"
);

const resumenEquiposCrud = createCrudService<ResumenEquipoDto>(
  BASE_RESUMEN_EQUIPOS,
  "resumenEquipoKey"
);

const reportesOperacionCrud = createCrudService<ReporteOperacionDto>(
  BASE_REPORTES_OPERACION,
  "reporteOperacionKey"
);

const detallesEquiposOperacionCrud =
  createCrudService<DetalleEquipoOperacionDto>(
    BASE_DETALLES_EQUIPOS,
    "detalleEquipoOperacionKey"
  );

const novedadesCrud = createCrudService<NovedadDto>(
  BASE_NOVEDADES,
  "novedadKey"
);

const informesSemanalesCrud = createCrudService<InformeSemanalDto>(
  BASE_INFORMES,
  "informeSemanalKey"
);

const actasModificacionCrud = createCrudService<ActaModificacionDto>(
  BASE_ACTAS,
  "actaModificacionKey"
);

const actasModificacionDetallesCrud =
  createCrudService<ActaModificacionDetalleDto>(
    BASE_ACTAS_DETALLES,
    "actaModificacionDetalleKey"
  );

export const controlObrasService = {
  ordenes: {
    ...ordenesCrud,

    async getByEstado(estado: string): Promise<ApiResponse<OrdenServicioDto>> {
      const response = await http.get<ApiResponse<OrdenServicioDto>>(
        `${BASE_ORDENES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  sitios: {
    ...sitiosCrud,

    async getByOrden(ordenKey: string): Promise<ApiResponse<SitioPuntoDto>> {
      const response = await http.get<ApiResponse<SitioPuntoDto>>(
        `${BASE_SITIOS}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    }
  },

  proyeccionSemanal: {
    ...proyeccionSemanalCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<ProyeccionDto>> {
      const response = await http.get<ApiResponse<ProyeccionDto>>(
        `${BASE_PROYECCION}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ProyeccionDto>> {
      const response = await http.get<ApiResponse<ProyeccionDto>>(
        `${BASE_PROYECCION}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  planes: {
    ...planesCrud,

    async getByOrden(ordenKey: string): Promise<ApiResponse<PlanTrabajoDto>> {
      const response = await http.get<ApiResponse<PlanTrabajoDto>>(
        `${BASE_PLANES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByPunto(puntoKey: string): Promise<ApiResponse<PlanTrabajoDto>> {
      const response = await http.get<ApiResponse<PlanTrabajoDto>>(
        `${BASE_PLANES}/by-punto`,
        {
          params: {
            puntoKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<PlanTrabajoDto>> {
      const response = await http.get<ApiResponse<PlanTrabajoDto>>(
        `${BASE_PLANES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  planesSemanales: {
    ...planesSemanalesCrud,

    async getByOrden(ordenKey: string): Promise<ApiResponse<PlanSemanalDto>> {
      const response = await http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByPlan(planKey: string): Promise<ApiResponse<PlanSemanalDto>> {
      const response = await http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-plan`,
        {
          params: {
            planKey
          }
        }
      );

      return response.data;
    },

    async getByProyeccionSemanal(
      proyeccionSemanalKey: string
    ): Promise<ApiResponse<PlanSemanalDto>> {
      const response = await http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-proyeccion-semanal`,
        {
          params: {
            proyeccionSemanalKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<PlanSemanalDto>> {
      const response = await http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  reportesDiarios: {
    ...reportesDiariosCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<ReporteDiarioDto>> {
      const response = await http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByPlanSemanal(
      planSemanalKey: string
    ): Promise<ApiResponse<ReporteDiarioDto>> {
      const response = await http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/by-plan-semanal`,
        {
          params: {
            planSemanalKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ReporteDiarioDto>> {
      const response = await http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  resumenEquipos: {
    ...resumenEquiposCrud,

    async getByOrden(ordenKey: string): Promise<ApiResponse<ResumenEquipoDto>> {
      const response = await http.get<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByEquipo(equipoKey: string): Promise<ApiResponse<ResumenEquipoDto>> {
      const response = await http.get<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/by-equipo`,
        {
          params: {
            equipoKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<ResumenEquipoDto>> {
      const response = await http.get<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  reportesOperacion: {
    ...reportesOperacionCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<ReporteOperacionDto>> {
      const response = await http.get<ApiResponse<ReporteOperacionDto>>(
        `${BASE_REPORTES_OPERACION}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ReporteOperacionDto>> {
      const response = await http.get<ApiResponse<ReporteOperacionDto>>(
        `${BASE_REPORTES_OPERACION}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  detallesEquiposOperacion: {
    ...detallesEquiposOperacionCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByEquipo(
      equipoKey: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-equipo`,
        {
          params: {
            equipoKey
          }
        }
      );

      return response.data;
    },

    async getByReporteOperacion(
      reporteOperacionKey: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-reporte-operacion`,
        {
          params: {
            reporteOperacionKey
          }
        }
      );

      return response.data;
    },

    async getByTipoEquipo(
      tipoEquipoKey: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-tipo-equipo`,
        {
          params: {
            tipoEquipoKey
          }
        }
      );

      return response.data;
    },

    async getByUnidad(
      unidadKey: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-unidad`,
        {
          params: {
            unidadKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<DetalleEquipoOperacionDto>> {
      const response = await http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  novedades: {
    ...novedadesCrud,

    async getByOrden(ordenKey: string): Promise<ApiResponse<NovedadDto>> {
      const response = await http.get<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByRegistroBase(
      registroBase: string
    ): Promise<ApiResponse<NovedadDto>> {
      const response = await http.get<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/by-registro-base`,
        {
          params: {
            registroBase
          }
        }
      );

      return response.data;
    },

    async getByTipoNovedad(
      tipoNovedad: string
    ): Promise<ApiResponse<NovedadDto>> {
      const response = await http.get<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/by-tipo-novedad`,
        {
          params: {
            tipoNovedad
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<NovedadDto>> {
      const response = await http.get<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  avances: {
    async health(): Promise<string> {
      const response = await http.get<string>(`${BASE_AVANCES}/health`);
      return response.data;
    },

    async getByOrden(ordenKey: string): Promise<ApiResponse<AvanceObraDto>> {
      const response = await http.get<ApiResponse<AvanceObraDto>>(
        `${BASE_AVANCES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByPlan(planKey: string): Promise<ApiResponse<AvanceObraDto>> {
      const response = await http.get<ApiResponse<AvanceObraDto>>(
        `${BASE_AVANCES}/by-plan`,
        {
          params: {
            planKey
          }
        }
      );

      return response.data;
    },

    async getByPlanSemanal(
      planSemanalKey: string
    ): Promise<ApiResponse<AvanceObraDto>> {
      const response = await http.get<ApiResponse<AvanceObraDto>>(
        `${BASE_AVANCES}/by-plan-semanal`,
        {
          params: {
            planSemanalKey
          }
        }
      );

      return response.data;
    },

    async getOrdenConsolidado(
      ordenKey: string
    ): Promise<ApiResponse<AvanceObraDto>> {
      const response = await http.get<ApiResponse<AvanceObraDto>>(
        `${BASE_AVANCES}/orden/${ordenKey}`
      );

      return response.data;
    }
  },

  informesSemanales: {
    ...informesSemanalesCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<InformeSemanalDto>> {
      const response = await http.get<ApiResponse<InformeSemanalDto>>(
        `${BASE_INFORMES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByProyeccionSemanal(
      proyeccionSemanalKey: string
    ): Promise<ApiResponse<InformeSemanalDto>> {
      const response = await http.get<ApiResponse<InformeSemanalDto>>(
        `${BASE_INFORMES}/by-proyeccion-semanal`,
        {
          params: {
            proyeccionSemanalKey
          }
        }
      );

      return response.data;
    },

    async getByPlanSemanal(
      planSemanalKey: string
    ): Promise<ApiResponse<InformeSemanalDto>> {
      const response = await http.get<ApiResponse<InformeSemanalDto>>(
        `${BASE_INFORMES}/by-plan-semanal`,
        {
          params: {
            planSemanalKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<InformeSemanalDto>> {
      const response = await http.get<ApiResponse<InformeSemanalDto>>(
        `${BASE_INFORMES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  actasModificacion: {
    ...actasModificacionCrud,

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<ActaModificacionDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDto>>(
        `${BASE_ACTAS}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ActaModificacionDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDto>>(
        `${BASE_ACTAS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  actasModificacionDetalles: {
    ...actasModificacionDetallesCrud,

    async getByActa(
      actaModificacionKey: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-acta`,
        {
          params: {
            actaModificacionKey
          }
        }
      );

      return response.data;
    },

    async getByOrden(
      ordenKey: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-orden`,
        {
          params: {
            ordenKey
          }
        }
      );

      return response.data;
    },

    async getByPlan(
      planKey: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-plan`,
        {
          params: {
            planKey
          }
        }
      );

      return response.data;
    },

    async getByPlanSemanal(
      planSemanalKey: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-plan-semanal`,
        {
          params: {
            planSemanalKey
          }
        }
      );

      return response.data;
    },

    async getByPunto(
      puntoKey: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-punto`,
        {
          params: {
            puntoKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ActaModificacionDetalleDto>> {
      const response = await http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  }
};

export const controlObras = controlObrasService;