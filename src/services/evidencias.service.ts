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
  EvidenciaDto,
  ReferenciaEvidenciaDto,
  TipoEvidenciaDto
} from "../types/evidencias.types";

const BASE_TIPOS = "/api/evidencias/tipos";
const BASE_REFERENCIAS = "/api/evidencias/referencias";
const BASE_EVIDENCIAS = "/api/evidencias/evidencias";

export const evidenciasService = {
  tipos: {
    health: () => http.get<string>(`${BASE_TIPOS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<TipoEvidenciaDto>>(`${BASE_TIPOS}/pages`, {
        params: buildPageParams(params)
      }),

    getByKey: (tipoEvidenciaKey: string) =>
      http.get<TipoEvidenciaDto>(`${BASE_TIPOS}/by-key`, {
        params: { tipoEvidenciaKey }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<TipoEvidenciaDto>>(`${BASE_TIPOS}/by-estado`, {
        params: { estado }
      }),

    create: (data: TipoEvidenciaDto) =>
      http.post<ApiResponse<TipoEvidenciaDto>>(
        `${BASE_TIPOS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: TipoEvidenciaDto) =>
      http.put<ApiResponse<TipoEvidenciaDto>>(
        `${BASE_TIPOS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<TipoEvidenciaDto>>(
        `${BASE_TIPOS}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: number) =>
      http.post<ApiResponse<TipoEvidenciaDto>>(
        `${BASE_TIPOS}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  },

  referencias: {
    health: () => http.get<string>(`${BASE_REFERENCIAS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/pages`,
        { params: buildPageParams(params) }
      ),

    getByKey: (referenciaKey: string) =>
      http.get<ReferenciaEvidenciaDto>(`${BASE_REFERENCIAS}/by-key`, {
        params: { referenciaKey }
      }),

    getByRegistro: (registroKey: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-registro`,
        { params: { registroKey } }
      ),

    getByTipoRegistro: (tipoRegistro: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-tipo-registro`,
        { params: { tipoRegistro } }
      ),

    getByTipoRegistroAndRegistro: (
      tipoRegistro: string,
      registroKey: string
    ) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-tipo-registro-and-registro`,
        { params: { tipoRegistro, registroKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/by-estado`,
        { params: { estado } }
      ),

    create: (data: ReferenciaEvidenciaDto) =>
      http.post<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: ReferenciaEvidenciaDto) =>
      http.put<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: number) =>
      http.post<ApiResponse<ReferenciaEvidenciaDto>>(
        `${BASE_REFERENCIAS}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  },

  evidencias: {
    health: () => http.get<string>(`${BASE_EVIDENCIAS}/health`),

    getPages: (params?: PageParams) =>
      http.get<ApiResponse<EvidenciaDto>>(`${BASE_EVIDENCIAS}/pages`, {
        params: buildPageParams(params)
      }),

    getByKey: (evidenciaKey: string) =>
      http.get<EvidenciaDto>(`${BASE_EVIDENCIAS}/by-key`, {
        params: { evidenciaKey }
      }),

    getByTipo: (tipoEvidenciaKey: string) =>
      http.get<ApiResponse<EvidenciaDto>>(`${BASE_EVIDENCIAS}/by-tipo`, {
        params: { tipoEvidenciaKey }
      }),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<EvidenciaDto>>(`${BASE_EVIDENCIAS}/by-estado`, {
        params: { estado }
      }),

    create: (data: EvidenciaDto) =>
      http.post<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/create`,
        buildApiWrapper(data)
      ),

    update: (id: number, data: EvidenciaDto) =>
      http.put<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/update/${id}`,
        buildApiWrapper(data)
      ),

    changeStatus: (recPKey: number, recEstreg: string) =>
      http.post<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/changestatus`,
        [
          {
            recPKey,
            recEstreg
          } satisfies ChangeStatusRequest
        ]
      ),

    delete: (recPKey: number) =>
      http.post<ApiResponse<EvidenciaDto>>(
        `${BASE_EVIDENCIAS}/delete`,
        [
          {
            recPKey
          } satisfies DeleteRequest
        ]
      )
  }
};