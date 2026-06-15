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
  EquipoDto,
  TipoEquipoDto,
  UnidadMedidaDto
} from "../types/equipos.types";

const BASE_UNIDADES = "/api/equipos-maquinaria/unidades";
const BASE_TIPOS = "/api/equipos-maquinaria/tipos";
const BASE_EQUIPOS = "/api/equipos-maquinaria/equipos";

export const equiposMaquinariaService = {
  unidades: {
    health: () => http.get<string>(`${BASE_UNIDADES}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<UnidadMedidaDto>>(`${BASE_UNIDADES}/pages`, {
        params: buildPageParams(params)
      }),

    getByKey: (unidadKey: string) =>
      http.get<UnidadMedidaDto>(`${BASE_UNIDADES}/by-key`, {
        params: { unidadKey }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<UnidadMedidaDto>>(`${BASE_UNIDADES}/by-estado`, {
        params: { estado }
      }),

    create: (data: UnidadMedidaDto) =>
      http.post<ApiResponse<UnidadMedidaDto>>(
        `${BASE_UNIDADES}/create`,
        buildApiWrapper(data)
      ),

    update: (unidadKey: string, data: UnidadMedidaDto) =>
      http.put<ApiResponse<UnidadMedidaDto>>(
        `${BASE_UNIDADES}/update/${unidadKey}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: string, recEstreg: string) =>
      http.post<ApiResponse<UnidadMedidaDto>>(
        `${BASE_UNIDADES}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: string) =>
      http.post<ApiResponse<UnidadMedidaDto>>(
        `${BASE_UNIDADES}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  },

  tipos: {
    health: () => http.get<string>(`${BASE_TIPOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<TipoEquipoDto>>(`${BASE_TIPOS}/pages`, {
        params: buildPageParams(params)
      }),

    getByKey: (tipoEquipoKey: string) =>
      http.get<TipoEquipoDto>(`${BASE_TIPOS}/by-key`, {
        params: { tipoEquipoKey }
      }),

    getByUnidad: (unidadKey: string) =>
      http.get<ApiResponse<TipoEquipoDto>>(`${BASE_TIPOS}/by-unidad`, {
        params: { unidadKey }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<TipoEquipoDto>>(`${BASE_TIPOS}/by-estado`, {
        params: { estado }
      }),

    create: (data: TipoEquipoDto) =>
      http.post<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: TipoEquipoDto) =>
      http.put<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: number) =>
      http.post<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  },

  equipos: {
    health: () => http.get<string>(`${BASE_EQUIPOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<EquipoDto>>(`${BASE_EQUIPOS}/pages`, {
        params: buildPageParams(params)
      }),

    getByKey: (equipoKey: string) =>
      http.get<EquipoDto>(`${BASE_EQUIPOS}/by-key`, {
        params: { equipoKey }
      }),

    getByProveedor: (proveedorKey: string) =>
      http.get<ApiResponse<EquipoDto>>(`${BASE_EQUIPOS}/by-proveedor`, {
        params: { proveedorKey }
      }),

    getByTipoEquipo: (tipoEquipoKey: string) =>
      http.get<ApiResponse<EquipoDto>>(`${BASE_EQUIPOS}/by-tipo-equipo`, {
        params: { tipoEquipoKey }
      }),

    getByDisponible: (disponible: string) =>
      http.get<ApiResponse<EquipoDto>>(`${BASE_EQUIPOS}/by-disponible`, {
        params: { disponible }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<EquipoDto>>(`${BASE_EQUIPOS}/by-estado`, {
        params: { estado }
      }),

    create: (data: EquipoDto) =>
      http.post<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: EquipoDto) =>
      http.put<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    changeDisponible: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/changedisponible`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: number) =>
      http.post<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  }
};

export const equiposService = equiposMaquinariaService;