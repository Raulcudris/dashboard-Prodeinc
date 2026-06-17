import { ApiResponse } from "../types/common.types";
import {
  EquipoDto,
  TipoEquipoDto,
  UnidadMedidaDto
} from "../types/equipos.types";
import { http } from "./apiClient";
import {
  buildChangeStatusPayload,
  createCrudService
} from "./crud.service";

const BASE_UNIDADES = "/api/equipos-maquinaria/unidades";
const BASE_TIPOS = "/api/equipos-maquinaria/tipos";
const BASE_EQUIPOS = "/api/equipos-maquinaria/equipos";

const unidadesCrud = createCrudService<UnidadMedidaDto>(
  BASE_UNIDADES,
  "unidadKey"
);

const tiposCrud = createCrudService<TipoEquipoDto>(
  BASE_TIPOS,
  "tipoEquipoKey"
);

const equiposCrud = createCrudService<EquipoDto>(
  BASE_EQUIPOS,
  "equipoKey"
);

export const equiposMaquinariaService = {
  unidades: {
    ...unidadesCrud,

    async getByEstado(estado: string): Promise<ApiResponse<UnidadMedidaDto>> {
      const response = await http.get<ApiResponse<UnidadMedidaDto>>(
        `${BASE_UNIDADES}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  tipos: {
    ...tiposCrud,

    async getByUnidad(unidadKey: string): Promise<ApiResponse<TipoEquipoDto>> {
      const response = await http.get<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/by-unidad`,
        {
          params: {
            unidadKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<TipoEquipoDto>> {
      const response = await http.get<ApiResponse<TipoEquipoDto>>(
        `${BASE_TIPOS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  equipos: {
    ...equiposCrud,

    async getByProveedor(proveedorKey: string): Promise<ApiResponse<EquipoDto>> {
      const response = await http.get<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/by-proveedor`,
        {
          params: {
            proveedorKey
          }
        }
      );

      return response.data;
    },

    async getByTipoEquipo(
      tipoEquipoKey: string
    ): Promise<ApiResponse<EquipoDto>> {
      const response = await http.get<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/by-tipo-equipo`,
        {
          params: {
            tipoEquipoKey
          }
        }
      );

      return response.data;
    },

    async getByDisponible(
      disponible: string
    ): Promise<ApiResponse<EquipoDto>> {
      const response = await http.get<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/by-disponible`,
        {
          params: {
            disponible
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<EquipoDto>> {
      const response = await http.get<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    },

    async changeDisponible(
      recPKey: number | string,
      recEstreg: string
    ): Promise<ApiResponse<EquipoDto>> {
      const response = await http.post<ApiResponse<EquipoDto>>(
        `${BASE_EQUIPOS}/changedisponible`,
        buildChangeStatusPayload(recPKey, recEstreg)
      );

      return response.data;
    }
  }
};

export const equiposService = equiposMaquinariaService;