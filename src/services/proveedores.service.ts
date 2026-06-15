import { http } from "./apiClient";
import {
  ApiResponse,
  PageParams,
  ChangeStatusRequest,
  DeleteRequest,
  buildApiWrapper,
  buildPageParams
} from "../types/common.types";
import { ProveedorDto } from "../types/proveedores.types";

const BASE_URL = "/api/proveedores/proveedores";

export const proveedoresService = {
  health: () => http.get<string>(`${BASE_URL}/health`),

  getPages: (params?: PageParams) =>
    http.get<ApiResponse<ProveedorDto>>(`${BASE_URL}/pages`, {
      params: buildPageParams(params)
    }),

  getAll: () =>
    http.get<ApiResponse<ProveedorDto>>(`${BASE_URL}/all`),

  get: (id: number) =>
    http.get<ProveedorDto>(`${BASE_URL}/get/${id}`),

  getByKey: (proveedorKey: string) =>
    http.get<ApiResponse<ProveedorDto>>(`${BASE_URL}/by-key`, {
      params: { proveedorKey }
    }),

  getByNit: (numeroNit: string) =>
    http.get<ApiResponse<ProveedorDto>>(`${BASE_URL}/by-nit`, {
      params: { numeroNit }
    }),

  getByEstado: (estado: string) =>
    http.get<ApiResponse<ProveedorDto>>(`${BASE_URL}/by-estado`, {
      params: { estado }
    }),

  create: (data: ProveedorDto) =>
    http.post<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/create`,
      buildApiWrapper(data)
    ),

  update: (id: number, data: ProveedorDto) =>
    http.put<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/update/${id}`,
      buildApiWrapper(data)
    ),

  changeStatus: (recPKey: number, recEstreg: string) =>
    http.post<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/changestatus`,
      [
        {
          recPKey,
          recEstreg
        } satisfies ChangeStatusRequest
      ]
    ),

  delete: (recPKey: number) =>
    http.post<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/delete`,
      [
        {
          recPKey
        } satisfies DeleteRequest
      ]
    )
};