import { http } from "./apiClient";
import { ApiResponse } from "../types/common.types";
import {
  EquipoDto,
  TipoEquipoDto,
  UnidadMedidaDto
} from "../types/equipos.types";

export interface EquiposPageParams {
  currentPage?: number;
  pageSize?: number;
  currentpage?: number;
  pagesize?: number;
  parameter?: string;
  filter?: string;
}

function buildPageParams(params?: EquiposPageParams) {
  const currentPage = params?.currentPage ?? params?.currentpage ?? 1;
  const pageSize = params?.pageSize ?? params?.pagesize ?? 100;

  return {
    currentPage,
    pageSize,
    currentpage: currentPage,
    pagesize: pageSize,
    parameter: params?.parameter ?? "TEXT",
    filter: params?.filter ?? ""
  };
}

export const equiposMaquinariaService = {
  unidades: {
    health: () =>
      http.get<string>("/api/equipos-maquinaria/unidades/health"),

    getPages: (params?: EquiposPageParams) =>
      http.get<ApiResponse<UnidadMedidaDto>>(
        "/api/equipos-maquinaria/unidades/pages",
        { params: buildPageParams(params) }
      ),

    get: (unidadKey: string) =>
      http.get<UnidadMedidaDto>(
        `/api/equipos-maquinaria/unidades/get/${unidadKey}`
      ),

    getByKey: (unidadKey: string) =>
      http.get<UnidadMedidaDto>(
        "/api/equipos-maquinaria/unidades/by-key",
        { params: { unidadKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<UnidadMedidaDto>>(
        "/api/equipos-maquinaria/unidades/by-estado",
        { params: { estado } }
      ),

    create: (data: UnidadMedidaDto) =>
      http.post<UnidadMedidaDto>(
        "/api/equipos-maquinaria/unidades/create",
        data
      ),

    update: (unidadKey: string, data: UnidadMedidaDto) =>
      http.put<UnidadMedidaDto>(
        `/api/equipos-maquinaria/unidades/update/${unidadKey}`,
        data
      ),

    changeStatus: (unidadKey: string, estado: string) =>
      http.patch<UnidadMedidaDto>(
        `/api/equipos-maquinaria/unidades/changestatus/${unidadKey}`,
        null,
        { params: { estado } }
      ),

    delete: (unidadKey: string) =>
      http.delete<void>(
        `/api/equipos-maquinaria/unidades/delete/${unidadKey}`
      )
  },

  tipos: {
    health: () =>
      http.get<string>("/api/equipos-maquinaria/tipos/health"),

    getPages: (params?: EquiposPageParams) =>
      http.get<ApiResponse<TipoEquipoDto>>(
        "/api/equipos-maquinaria/tipos/pages",
        { params: buildPageParams(params) }
      ),

    get: (id: number) =>
      http.get<TipoEquipoDto>(
        `/api/equipos-maquinaria/tipos/get/${id}`
      ),

    getByKey: (tipoEquipoKey: string) =>
      http.get<TipoEquipoDto>(
        "/api/equipos-maquinaria/tipos/by-key",
        { params: { tipoEquipoKey } }
      ),

    getByUnidad: (unidadKey: string) =>
      http.get<ApiResponse<TipoEquipoDto>>(
        "/api/equipos-maquinaria/tipos/by-unidad",
        { params: { unidadKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<TipoEquipoDto>>(
        "/api/equipos-maquinaria/tipos/by-estado",
        { params: { estado } }
      ),

    create: (data: TipoEquipoDto) =>
      http.post<TipoEquipoDto>(
        "/api/equipos-maquinaria/tipos/create",
        data
      ),

    createList: (data: TipoEquipoDto[]) =>
      http.post<TipoEquipoDto[]>(
        "/api/equipos-maquinaria/tipos/create-list",
        data
      ),

    update: (id: number, data: TipoEquipoDto) =>
      http.put<TipoEquipoDto>(
        `/api/equipos-maquinaria/tipos/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<TipoEquipoDto>(
        `/api/equipos-maquinaria/tipos/changestatus/${id}`,
        null,
        { params: { estado } }
      ),

    delete: (id: number) =>
      http.delete<void>(
        `/api/equipos-maquinaria/tipos/delete/${id}`
      )
  },

  equipos: {
    health: () =>
      http.get<string>("/api/equipos-maquinaria/equipos/health"),

    getPages: (params?: EquiposPageParams) =>
      http.get<ApiResponse<EquipoDto>>(
        "/api/equipos-maquinaria/equipos/pages",
        { params: buildPageParams(params) }
      ),

    get: (id: number) =>
      http.get<EquipoDto>(
        `/api/equipos-maquinaria/equipos/get/${id}`
      ),

    getByKey: (equipoKey: string) =>
      http.get<EquipoDto>(
        "/api/equipos-maquinaria/equipos/by-key",
        { params: { equipoKey } }
      ),

    getByProveedor: (proveedorKey: string) =>
      http.get<ApiResponse<EquipoDto>>(
        "/api/equipos-maquinaria/equipos/by-proveedor",
        { params: { proveedorKey } }
      ),

    getByTipoEquipo: (tipoEquipoKey: string) =>
      http.get<ApiResponse<EquipoDto>>(
        "/api/equipos-maquinaria/equipos/by-tipo-equipo",
        { params: { tipoEquipoKey } }
      ),

    getByDisponible: (disponible: string) =>
      http.get<ApiResponse<EquipoDto>>(
        "/api/equipos-maquinaria/equipos/by-disponible",
        { params: { disponible } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<EquipoDto>>(
        "/api/equipos-maquinaria/equipos/by-estado",
        { params: { estado } }
      ),

    create: (data: EquipoDto) =>
      http.post<EquipoDto>(
        "/api/equipos-maquinaria/equipos/create",
        data
      ),

    createList: (data: EquipoDto[]) =>
      http.post<EquipoDto[]>(
        "/api/equipos-maquinaria/equipos/create-list",
        data
      ),

    update: (id: number, data: EquipoDto) =>
      http.put<EquipoDto>(
        `/api/equipos-maquinaria/equipos/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<EquipoDto>(
        `/api/equipos-maquinaria/equipos/changestatus/${id}`,
        null,
        { params: { estado } }
      ),

    changeDisponible: (id: number, disponible: string) =>
      http.patch<EquipoDto>(
        `/api/equipos-maquinaria/equipos/changedisponible/${id}`,
        null,
        { params: { disponible } }
      ),

    delete: (id: number) =>
      http.delete<void>(
        `/api/equipos-maquinaria/equipos/delete/${id}`
      )
  }
};

export const equiposService = equiposMaquinariaService;