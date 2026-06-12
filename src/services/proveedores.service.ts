import { http } from "./apiClient";
import { ApiResponse } from "../types/common.types";
import { ProveedorDto } from "../types/proveedores.types";

export const proveedoresService = {
  health: () => http.get<string>("/api/proveedores/health"),

  getPages: (params?: Record<string, unknown>) =>
    http.get<ApiResponse<ProveedorDto>>(
      "/api/proveedores/proveedores/pages",
      { params }
    ),

  getByKey: (proveedorKey: string) =>
    http.get<ApiResponse<ProveedorDto>>(
      "/api/proveedores/proveedores/by-key",
      { params: { proveedorKey } }
    ),

  getByEstado: (estado: string) =>
    http.get<ApiResponse<ProveedorDto>>(
      "/api/proveedores/proveedores/by-estado",
      { params: { estado } }
    ),

  create: (data: ProveedorDto) =>
    http.post<ApiResponse<ProveedorDto>>(
      "/api/proveedores/proveedores/create",
      data
    ),

  update: (id: number, data: ProveedorDto) =>
    http.put<ApiResponse<ProveedorDto>>(
      `/api/proveedores/proveedores/update/${id}`,
      data
    ),

  changeStatus: (id: number, estado: string) =>
    http.patch<ApiResponse<ProveedorDto>>(
      `/api/proveedores/proveedores/changestatus/${id}`,
      null,
      { params: { estado } }
    )
};