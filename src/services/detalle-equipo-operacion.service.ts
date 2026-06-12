import { http } from "./apiClient";
import { ApiResponse } from "../types/common.types";
import { DetalleEquipoOperacionDto } from "../types/detalle-equipo-operacion.types";

export interface DetalleEquipoOperacionPageParams {
  currentPage?: number;
  pageSize?: number;
  currentpage?: number;
  pagesize?: number;
  parameter?: string;
  filter?: string;
}

function buildPageParams(params?: DetalleEquipoOperacionPageParams) {
  const currentPage = params?.currentPage ?? params?.currentpage ?? 1;
  const pageSize = params?.pageSize ?? params?.pagesize ?? 10;

  return {
    currentPage,
    pageSize,
    currentpage: currentPage,
    pagesize: pageSize,
    parameter: params?.parameter ?? "TEXT",
    filter: params?.filter ?? ""
  };
}

const BASE_URL = "/api/control-obras/detalles-equipos-operacion";

export const detalleEquipoOperacionService = {
  health: () =>
    http.get<string>(`${BASE_URL}/health`),

  getAll: () =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(`${BASE_URL}/all`),

  getPages: (params?: DetalleEquipoOperacionPageParams) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(`${BASE_URL}/pages`, {
      params: buildPageParams(params)
    }),

  get: (id: number) =>
    http.get<DetalleEquipoOperacionDto>(`${BASE_URL}/get/${id}`),

  getByKey: (detalleEquipoOperacionKey: string) =>
    http.get<DetalleEquipoOperacionDto>(`${BASE_URL}/by-key`, {
      params: { detalleEquipoOperacionKey }
    }),

  getByReporteOperacion: (reporteOperacionKey: string) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(
      `${BASE_URL}/by-reporte-operacion`,
      { params: { reporteOperacionKey } }
    ),

  getByEquipo: (equipoKey: string) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(
      `${BASE_URL}/by-equipo`,
      { params: { equipoKey } }
    ),

  getByTipoEquipo: (tipoEquipoKey: string) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(
      `${BASE_URL}/by-tipo-equipo`,
      { params: { tipoEquipoKey } }
    ),

  getByUnidad: (unidadKey: string) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(
      `${BASE_URL}/by-unidad`,
      { params: { unidadKey } }
    ),

  getByEstado: (estado: string) =>
    http.get<ApiResponse<DetalleEquipoOperacionDto>>(
      `${BASE_URL}/by-estado`,
      { params: { estado } }
    ),

  create: (data: DetalleEquipoOperacionDto) =>
    http.post<DetalleEquipoOperacionDto>(`${BASE_URL}/create`, data),

  createList: (data: DetalleEquipoOperacionDto[]) =>
    http.post<DetalleEquipoOperacionDto[]>(`${BASE_URL}/create-list`, data),

  update: (id: number, data: DetalleEquipoOperacionDto) =>
    http.put<DetalleEquipoOperacionDto>(`${BASE_URL}/update/${id}`, data),

  changeStatus: (id: number, estado: string) =>
    http.patch<DetalleEquipoOperacionDto>(
      `${BASE_URL}/changestatus/${id}`,
      null,
      { params: { estado } }
    ),

  delete: (id: number) =>
    http.delete<void>(`${BASE_URL}/delete/${id}`)
};