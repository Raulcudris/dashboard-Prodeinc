import { http } from "./apiClient";
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
  ProyeccionSemanalDto,
  ReporteDiarioDto,
  ReporteOperacionDto,
  ResumenEquipoDto,
  SitioPuntoDto
} from "../types/controlObras.types";

export const controlObrasService = {
  ordenes: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<OrdenServicioDto>>(
        "/api/control-obras/ordenes/pages",
        { params }
      ),

    getByKey: (ordenKey: string) =>
      http.get<ApiResponse<OrdenServicioDto>>(
        "/api/control-obras/ordenes/by-key",
        { params: { ordenKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<OrdenServicioDto>>(
        "/api/control-obras/ordenes/by-estado",
        { params: { estado } }
      ),

    create: (data: OrdenServicioDto) =>
      http.post<ApiResponse<OrdenServicioDto>>(
        "/api/control-obras/ordenes/create",
        data
      ),

    update: (id: number, data: OrdenServicioDto) =>
      http.put<ApiResponse<OrdenServicioDto>>(
        `/api/control-obras/ordenes/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<ApiResponse<OrdenServicioDto>>(
        `/api/control-obras/ordenes/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  },

  resumenEquipos: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ResumenEquipoDto>>(
        "/api/control-obras/resumen-equipos/pages",
        { params }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<ResumenEquipoDto>>(
        "/api/control-obras/resumen-equipos/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: ResumenEquipoDto) =>
      http.post<ApiResponse<ResumenEquipoDto>>(
        "/api/control-obras/resumen-equipos/create",
        data
      )
  },

  sitios: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<SitioPuntoDto>>(
        "/api/control-obras/sitios/pages",
        { params }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<SitioPuntoDto>>(
        "/api/control-obras/sitios/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: SitioPuntoDto) =>
      http.post<ApiResponse<SitioPuntoDto>>(
        "/api/control-obras/sitios/create",
        data
      )
  },

    proyeccionSemanal: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ProyeccionSemanalDto>>(
        "/api/control-obras/proyeccion-semanal/pages",
        { params }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<ProyeccionSemanalDto>>(
        "/api/control-obras/proyeccion-semanal/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: ProyeccionSemanalDto) =>
      http.post<ApiResponse<ProyeccionSemanalDto>>(
        "/api/control-obras/proyeccion-semanal/create",
        data
      )
  },

  planes: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<PlanTrabajoDto>>(
        "/api/control-obras/planes/pages",
        { params }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<PlanTrabajoDto>>(
        "/api/control-obras/planes/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: PlanTrabajoDto) =>
      http.post<ApiResponse<PlanTrabajoDto>>(
        "/api/control-obras/planes/create",
        data
      )
  },
  planesSemanales: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<PlanSemanalDto>>(
        "/api/control-obras/planes-semanales/pages",
        { params }
      ),

    getByPlan: (planKey: string) =>
      http.get<ApiResponse<PlanSemanalDto>>(
        "/api/control-obras/planes-semanales/by-plan",
        { params: { planKey } }
      ),

    create: (data: PlanSemanalDto) =>
      http.post<ApiResponse<PlanSemanalDto>>(
        "/api/control-obras/planes-semanales/create",
        data
      )
  },
    reportesDiarios: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ReporteDiarioDto>>(
        "/api/control-obras/reportes-diarios/pages",
        { params }
      ),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<ApiResponse<ReporteDiarioDto>>(
        "/api/control-obras/reportes-diarios/by-plan-semanal",
        { params: { planSemanalKey } }
      ),

    create: (data: ReporteDiarioDto) =>
      http.post<ApiResponse<ReporteDiarioDto>>(
        "/api/control-obras/reportes-diarios/create",
        data
      )
  },

  novedades: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<NovedadDto>>(
        "/api/control-obras/novedades/pages",
        { params }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<NovedadDto>>(
        "/api/control-obras/novedades/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: NovedadDto) =>
      http.post<ApiResponse<NovedadDto>>(
        "/api/control-obras/novedades/create",
        data
      )
  },
    avances: {
    getByOrden: (ordenKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(
        "/api/control-obras/avances/by-orden",
        { params: { ordenKey } }
      ),

    getByPlan: (planKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(
        "/api/control-obras/avances/by-plan",
        { params: { planKey } }
      ),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<ApiResponse<AvanceObraDto>>(
        "/api/control-obras/avances/by-plan-semanal",
        { params: { planSemanalKey } }
      )
  },
  reportesOperacion: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ReporteOperacionDto>>(
        "/api/control-obras/reportes-operacion/pages",
        { params }
      ),

    getByKey: (reporteOperacionKey: string) =>
      http.get<ReporteOperacionDto>(
        "/api/control-obras/reportes-operacion/by-key",
        { params: { reporteOperacionKey } }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ReporteOperacionDto[]>(
        "/api/control-obras/reportes-operacion/by-orden",
        { params: { ordenKey } }
      ),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<ReporteOperacionDto[]>(
        "/api/control-obras/reportes-operacion/by-plan-semanal",
        { params: { planSemanalKey } }
      ),

    getByPunto: (puntoKey: string) =>
      http.get<ReporteOperacionDto[]>(
        "/api/control-obras/reportes-operacion/by-punto",
        { params: { puntoKey } }
      ),

    create: (data: ReporteOperacionDto) =>
      http.post<ReporteOperacionDto>(
        "/api/control-obras/reportes-operacion/create",
        data
      ),

    update: (id: number, data: ReporteOperacionDto) =>
      http.put<ReporteOperacionDto>(
        `/api/control-obras/reportes-operacion/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<ReporteOperacionDto>(
        `/api/control-obras/reportes-operacion/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  },

  detallesEquiposOperacion: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<DetalleEquipoOperacionDto>>(
        "/api/control-obras/detalles-equipos-operacion/pages",
        { params }
      ),

    getByKey: (detalleEquipoOperacionKey: string) =>
      http.get<DetalleEquipoOperacionDto>(
        "/api/control-obras/detalles-equipos-operacion/by-key",
        { params: { detalleEquipoOperacionKey } }
      ),

    getByReporteOperacion: (reporteOperacionKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        "/api/control-obras/detalles-equipos-operacion/by-reporte-operacion",
        { params: { reporteOperacionKey } }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        "/api/control-obras/detalles-equipos-operacion/by-orden",
        { params: { ordenKey } }
      ),

    getByPlanSemanal: (planSemanalKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        "/api/control-obras/detalles-equipos-operacion/by-plan-semanal",
        { params: { planSemanalKey } }
      ),

    getByEquipo: (equipoKey: string) =>
      http.get<DetalleEquipoOperacionDto[]>(
        "/api/control-obras/detalles-equipos-operacion/by-equipo",
        { params: { equipoKey } }
      ),

    create: (data: DetalleEquipoOperacionDto) =>
      http.post<DetalleEquipoOperacionDto>(
        "/api/control-obras/detalles-equipos-operacion/create",
        data
      ),

    update: (id: number, data: DetalleEquipoOperacionDto) =>
      http.put<DetalleEquipoOperacionDto>(
        `/api/control-obras/detalles-equipos-operacion/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<DetalleEquipoOperacionDto>(
        `/api/control-obras/detalles-equipos-operacion/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  },

  informesSemanales: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<InformeSemanalDto>>(
        "/api/control-obras/informes-semanales/pages",
        { params }
      ),

    getByKey: (informeSemanalKey: string) =>
      http.get<InformeSemanalDto>(
        "/api/control-obras/informes-semanales/by-key",
        { params: { informeSemanalKey } }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<InformeSemanalDto[]>(
        "/api/control-obras/informes-semanales/by-orden",
        { params: { ordenKey } }
      ),

    getBySemana: (semana: number) =>
      http.get<InformeSemanalDto[]>(
        "/api/control-obras/informes-semanales/by-semana",
        { params: { semana } }
      ),

    create: (data: InformeSemanalDto) =>
      http.post<InformeSemanalDto>(
        "/api/control-obras/informes-semanales/create",
        data
      ),

    update: (id: number, data: InformeSemanalDto) =>
      http.put<InformeSemanalDto>(
        `/api/control-obras/informes-semanales/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<InformeSemanalDto>(
        `/api/control-obras/informes-semanales/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  },

  actasModificacion: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ActaModificacionDto>>(
        "/api/control-obras/actas-modificacion/pages",
        { params }
      ),

    getByKey: (actaModificacionKey: string) =>
      http.get<ActaModificacionDto>(
        "/api/control-obras/actas-modificacion/by-key",
        { params: { actaModificacionKey } }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ActaModificacionDto[]>(
        "/api/control-obras/actas-modificacion/by-orden",
        { params: { ordenKey } }
      ),

    getByEstadoActa: (estadoActa: string) =>
      http.get<ActaModificacionDto[]>(
        "/api/control-obras/actas-modificacion/by-estado-acta",
        { params: { estadoActa } }
      ),

    create: (data: ActaModificacionDto) =>
      http.post<ActaModificacionDto>(
        "/api/control-obras/actas-modificacion/create",
        data
      ),

    update: (id: number, data: ActaModificacionDto) =>
      http.put<ActaModificacionDto>(
        `/api/control-obras/actas-modificacion/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<ActaModificacionDto>(
        `/api/control-obras/actas-modificacion/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  },

  actasModificacionDetalles: {
    getPages: (params?: Record<string, unknown>) =>
      http.get<ApiResponse<ActaModificacionDetalleDto>>(
        "/api/control-obras/actas-modificacion-detalles/pages",
        { params }
      ),

    getByKey: (detalleActaModificacionKey: string) =>
      http.get<ActaModificacionDetalleDto>(
        "/api/control-obras/actas-modificacion-detalles/by-key",
        { params: { detalleActaModificacionKey } }
      ),

    getByActa: (actaModificacionKey: string) =>
      http.get<ActaModificacionDetalleDto[]>(
        "/api/control-obras/actas-modificacion-detalles/by-acta",
        { params: { actaModificacionKey } }
      ),

    getByOrden: (ordenKey: string) =>
      http.get<ActaModificacionDetalleDto[]>(
        "/api/control-obras/actas-modificacion-detalles/by-orden",
        { params: { ordenKey } }
      ),

    create: (data: ActaModificacionDetalleDto) =>
      http.post<ActaModificacionDetalleDto>(
        "/api/control-obras/actas-modificacion-detalles/create",
        data
      ),

    update: (id: number, data: ActaModificacionDetalleDto) =>
      http.put<ActaModificacionDetalleDto>(
        `/api/control-obras/actas-modificacion-detalles/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<ActaModificacionDetalleDto>(
        `/api/control-obras/actas-modificacion-detalles/changestatus/${id}`,
        null,
        { params: { estado } }
      )
  }  

};