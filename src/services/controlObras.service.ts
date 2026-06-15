import { http } from "./apiClient";
import {
  ApiResponse,
  PageParams,
  ChangeStatusRequest,
  DeleteRequest,
  buildApiWrapper,
  buildPageParams
} from "../types/common.types";
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
  ProyeccionSemanalDto,
  ReporteDiarioDto,
  ReporteOperacionDto,
  ResumenEquipoDto,
  SitioPuntoDto
} from "../types/controlObras.types";

function changeStatus<T>(baseUrl: string, recPKey: number, recEstreg: string) {
  return http.post<ApiResponse<T>>(`${baseUrl}/changestatus`, [
    {
      recPKey,
      recEstreg
    } satisfies ChangeStatusRequest
  ]);
}

function deleteByBody<T>(baseUrl: string, recPKey: number) {
  return http.post<ApiResponse<T>>(`${baseUrl}/delete`, [
    {
      recPKey
    } satisfies DeleteRequest
  ]);
}

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

export const controlObrasService = {
  ordenes: {
    health: () => http.get<string>(`${BASE_ORDENES}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<OrdenServicioDto>>(`${BASE_ORDENES}/pages`, {
        params: buildPageParams(params)
      }),

    get: (id: number) =>
      http.get<OrdenServicioDto>(`${BASE_ORDENES}/get/${id}`),

    getByKey: (ordenKey: string) =>
      http.get<ApiResponse<OrdenServicioDto>>(`${BASE_ORDENES}/by-key`, {
        params: { ordenKey }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<OrdenServicioDto>>(`${BASE_ORDENES}/by-estado`, {
        params: { estado }
      }),

    create: (data: OrdenServicioDto) =>
      http.post<ApiResponse<OrdenServicioDto>>(
        `${BASE_ORDENES}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: OrdenServicioDto) =>
      http.put<ApiResponse<OrdenServicioDto>>(
        `${BASE_ORDENES}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<OrdenServicioDto>(BASE_ORDENES, recPKey, recEstreg),

    delete: (recPKey: number) =>
      deleteByBody<OrdenServicioDto>(BASE_ORDENES, recPKey)
  },

  sitios: {
    health: () => http.get<string>(`${BASE_SITIOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<SitioPuntoDto>>(`${BASE_SITIOS}/pages`, {
        params: buildPageParams(params)
      }),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<SitioPuntoDto>>(`${BASE_SITIOS}/by-orden`, {
        params: { ordenKey }
      }),

    create: (data: SitioPuntoDto) =>
      http.post<ApiResponse<SitioPuntoDto>>(
        `${BASE_SITIOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: SitioPuntoDto) =>
      http.put<ApiResponse<SitioPuntoDto>>(
        `${BASE_SITIOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<SitioPuntoDto>(BASE_SITIOS, recPKey, recEstreg),

    delete: (recPKey: number) =>
      deleteByBody<SitioPuntoDto>(BASE_SITIOS, recPKey)
  },

  proyeccionSemanal: {
    health: () => http.get<string>(`${BASE_PROYECCION}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ProyeccionSemanalDto>>(
        `${BASE_PROYECCION}/pages`,
        { params: buildPageParams(params) }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<ProyeccionSemanalDto>>(
        `${BASE_PROYECCION}/by-orden`,
        { params: { ordenKey } }
      ),

    create: (data: ProyeccionSemanalDto) =>
      http.post<ApiResponse<ProyeccionSemanalDto>>(
        `${BASE_PROYECCION}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ProyeccionSemanalDto) =>
      http.put<ApiResponse<ProyeccionSemanalDto>>(
        `${BASE_PROYECCION}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<ProyeccionSemanalDto>(
        BASE_PROYECCION,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<ProyeccionSemanalDto>(BASE_PROYECCION, recPKey)
  },

  planes: {
    health: () => http.get<string>(`${BASE_PLANES}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<PlanTrabajoDto>>(`${BASE_PLANES}/pages`, {
        params: buildPageParams(params)
      }),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<PlanTrabajoDto>>(`${BASE_PLANES}/by-orden`, {
        params: { ordenKey }
      }),

    getByPunto: (puntoKey: string) =>
      http.get<ApiResponse<PlanTrabajoDto>>(`${BASE_PLANES}/by-punto`, {
        params: { puntoKey }
      }),

    create: (data: PlanTrabajoDto) =>
      http.post<ApiResponse<PlanTrabajoDto>>(
        `${BASE_PLANES}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: PlanTrabajoDto) =>
      http.put<ApiResponse<PlanTrabajoDto>>(
        `${BASE_PLANES}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<PlanTrabajoDto>(BASE_PLANES, recPKey, recEstreg),

    delete: (recPKey: number) =>
      deleteByBody<PlanTrabajoDto>(BASE_PLANES, recPKey)
  },

  planesSemanales: {
    health: () => http.get<string>(`${BASE_PLANES_SEMANALES}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/pages`,
        { params: buildPageParams(params) }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-orden`,
        { params: { ordenKey } }
      ),

    getByPlan: (planKey: string) =>
      http.get<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/by-plan`,
        { params: { planKey } }
      ),

    create: (data: PlanSemanalDto) =>
      http.post<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: PlanSemanalDto) =>
      http.put<ApiResponse<PlanSemanalDto>>(
        `${BASE_PLANES_SEMANALES}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<PlanSemanalDto>(
        BASE_PLANES_SEMANALES,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<PlanSemanalDto>(BASE_PLANES_SEMANALES, recPKey)
  },

  reportesDiarios: {
    health: () => http.get<string>(`${BASE_REPORTES_DIARIOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/pages`,
        { params: buildPageParams(params) }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/by-orden`,
        { params: { ordenKey } }
      ),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/by-plan-semanal`,
        { params: { planSemanalKey } }
      ),

    create: (data: ReporteDiarioDto) =>
      http.post<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ReporteDiarioDto) =>
      http.put<ApiResponse<ReporteDiarioDto>>(
        `${BASE_REPORTES_DIARIOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<ReporteDiarioDto>(
        BASE_REPORTES_DIARIOS,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<ReporteDiarioDto>(BASE_REPORTES_DIARIOS, recPKey)
  },

  resumenEquipos: {
    health: () => http.get<string>(`${BASE_RESUMEN_EQUIPOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/pages`,
        { params: buildPageParams(params) }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/by-orden`,
        { params: { ordenKey } }
      ),

    create: (data: ResumenEquipoDto) =>
      http.post<ApiResponse<ResumenEquipoDto>>(
        `${BASE_RESUMEN_EQUIPOS}/create`,
        buildApiWrapper(data)
      )
  },

  reportesOperacion: {
    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ReporteOperacionDto>>(
        `${BASE_REPORTES_OPERACION}/pages`,
        { params: buildPageParams(params) }
      ),

    getByKey: (reporteOperacionKey: string) =>
      http.get<ReporteOperacionDto>(`${BASE_REPORTES_OPERACION}/by-key`, {
        params: { reporteOperacionKey }
      }),

    getByOrden: (ordenKey: string) =>
      http.get<ReporteOperacionDto[]>(`${BASE_REPORTES_OPERACION}/by-orden`, {
        params: { ordenKey }
      }),

    create: (data: ReporteOperacionDto) =>
      http.post<ApiResponse<ReporteOperacionDto>>(
        `${BASE_REPORTES_OPERACION}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ReporteOperacionDto) =>
      http.put<ApiResponse<ReporteOperacionDto>>(
        `${BASE_REPORTES_OPERACION}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<ReporteOperacionDto>(
        BASE_REPORTES_OPERACION,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<ReporteOperacionDto>(BASE_REPORTES_OPERACION, recPKey)
  },

  detallesEquiposOperacion: {
    health: () => http.get<string>(`${BASE_DETALLES_EQUIPOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/pages`,
        { params: buildPageParams(params) }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        `${BASE_DETALLES_EQUIPOS}/by-orden`,
        { params: { ordenKey } }
      ),

    getByEquipo: (equipoKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        `${BASE_DETALLES_EQUIPOS}/by-equipo`,
        { params: { equipoKey } }
      ),

    create: (data: DetalleEquipoOperacionDto) =>
      http.post<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: DetalleEquipoOperacionDto) =>
      http.put<ApiResponse<DetalleEquipoOperacionDto>>(
        `${BASE_DETALLES_EQUIPOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<DetalleEquipoOperacionDto>(
        BASE_DETALLES_EQUIPOS,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<DetalleEquipoOperacionDto>(
        BASE_DETALLES_EQUIPOS,
        recPKey
      )
  },

  novedades: {
    health: () => http.get<string>(`${BASE_NOVEDADES}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<NovedadDto>>(`${BASE_NOVEDADES}/pages`, {
        params: buildPageParams(params)
      }),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<NovedadDto>>(`${BASE_NOVEDADES}/by-orden`, {
        params: { ordenKey }
      }),

    getByRegistroBase: (registroBase: string) =>
      http.get<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/by-registro-base`,
        { params: { registroBase } }
      ),

    create: (data: NovedadDto) =>
      http.post<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: NovedadDto) =>
      http.put<ApiResponse<NovedadDto>>(
        `${BASE_NOVEDADES}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<NovedadDto>(BASE_NOVEDADES, recPKey, recEstreg),

    delete: (recPKey: number) =>
      deleteByBody<NovedadDto>(BASE_NOVEDADES, recPKey)
  },

  avances: {
    health: () => http.get<string>(`${BASE_AVANCES}/health`),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(`${BASE_AVANCES}/by-orden`, {
        params: { ordenKey }
      }),

    getByPlan: (planKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(`${BASE_AVANCES}/by-plan`, {
        params: { planKey }
      }),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(
        `${BASE_AVANCES}/by-plan-semanal`,
        { params: { planSemanalKey } }
      ),

    getOrdenConsolidado: (ordenKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(`${BASE_AVANCES}/orden/${ordenKey}`)
  },

  informesSemanales: {
    getPages: (params?: PageParams) =>
      http.get<ApiResponse<InformeSemanalDto>>(`${BASE_INFORMES}/pages`, {
        params: buildPageParams(params)
      })
  },

  actasModificacion: {
    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ActaModificacionDto>>(`${BASE_ACTAS}/pages`, {
        params: buildPageParams(params)
      }),

    create: (data: ActaModificacionDto) =>
      http.post<ApiResponse<ActaModificacionDto>>(
        `${BASE_ACTAS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ActaModificacionDto) =>
      http.put<ApiResponse<ActaModificacionDto>>(
        `${BASE_ACTAS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<ActaModificacionDto>(BASE_ACTAS, recPKey, recEstreg),

    delete: (recPKey: number) =>
      deleteByBody<ActaModificacionDto>(BASE_ACTAS, recPKey)
  },

  actasModificacionDetalles: {
    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/pages`,
        { params: buildPageParams(params) }
      ),

    create: (data: ActaModificacionDetalleDto) =>
      http.post<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ActaModificacionDetalleDto) =>
      http.put<ApiResponse<ActaModificacionDetalleDto>>(
        `${BASE_ACTAS_DETALLES}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      changeStatus<ActaModificacionDetalleDto>(
        BASE_ACTAS_DETALLES,
        recPKey,
        recEstreg
      ),

    delete: (recPKey: number) =>
      deleteByBody<ActaModificacionDetalleDto>(
        BASE_ACTAS_DETALLES,
        recPKey
      )
  }
};