import { ApiResponse, PageParams } from "../types/common.types";
import { ProveedorDto } from "../types/proveedores.types";
import { http } from "./apiClient";
import { createCrudService } from "./crud.service";

const BASE_URL = "/api/proveedores/proveedores";

const crud = createCrudService<ProveedorDto>(BASE_URL, "proveedorKey");

export const proveedoresService = {
  ...crud,

  async getByNit(numeroNit: string): Promise<ApiResponse<ProveedorDto>> {
    const response = await http.get<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/by-nit`,
      {
        params: {
          numeroNit
        }
      }
    );

    return response.data;
  },

  async getByEstado(estado: string): Promise<ApiResponse<ProveedorDto>> {
    const response = await http.get<ApiResponse<ProveedorDto>>(
      `${BASE_URL}/by-estado`,
      {
        params: {
          estado
        }
      }
    );

    return response.data;
  },

  async search(params?: PageParams): Promise<ApiResponse<ProveedorDto>> {
    return crud.getPages(params);
  }
};