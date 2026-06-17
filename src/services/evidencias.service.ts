import { ApiResponse } from "../types/common.types";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto,
  TipoEvidenciaDto
} from "../types/evidencias.types";
import { http } from "./apiClient";
import { createCrudService } from "./crud.service";

const BASE_TIPOS = "/api/evidencias/tipos";
const BASE_REFERENCIAS = "/api/evidencias/referencias";
const BASE_EVIDENCIAS = "/api/evidencias/evidencias";

const tiposCrud = createCrudService<TipoEvidenciaDto>(
  BASE_TIPOS,
  "tipoEvidenciaKey"
);

const referenciasCrud = createCrudService<ReferenciaEvidenciaDto>(
  BASE_REFERENCIAS,
  "referenciaKey"
);

const evidenciasCrud = createCrudService<EvidenciaDto>(
  BASE_EVIDENCIAS,
  "evidenciaKey"
);

export const evidenciasService = {
  tipos: {
    ...tiposCrud,

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<TipoEvidenciaDto>> {
      const response = await http.get<ApiResponse<TipoEvidenciaDto>>(
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

  referencias: {
    ...referenciasCrud,

    async getByRegistro(
      registroKey: string
    ): Promise<ApiResponse<ReferenciaEvidenciaDto>> {
      const response = await http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-registro`,
        {
          params: {
            registroKey
          }
        }
      );

      return response.data;
    },

    async getByTipoRegistro(
      tipoRegistro: string
    ): Promise<ApiResponse<ReferenciaEvidenciaDto>> {
      const response = await http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-tipo-registro`,
        {
          params: {
            tipoRegistro
          }
        }
      );

      return response.data;
    },

    async getByTipoRegistroAndRegistro(
      tipoRegistro: string,
      registroKey: string
    ): Promise<ApiResponse<ReferenciaEvidenciaDto>> {
      const response = await http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-tipo-registro-and-registro`,
        {
          params: {
            tipoRegistro,
            registroKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(
      estado: string
    ): Promise<ApiResponse<ReferenciaEvidenciaDto>> {
      const response = await http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-estado`,
        {
          params: {
            estado
          }
        }
      );

      return response.data;
    }
  },

  evidencias: {
    ...evidenciasCrud,

    async getByTipo(
      tipoEvidenciaKey: string
    ): Promise<ApiResponse<EvidenciaDto>> {
      const response = await http.get<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/by-tipo`,
        {
          params: {
            tipoEvidenciaKey
          }
        }
      );

      return response.data;
    },

    async getByEstado(estado: string): Promise<ApiResponse<EvidenciaDto>> {
      const response = await http.get<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/by-estado`,
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