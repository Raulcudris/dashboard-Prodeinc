import { http } from "./apiClient";
import { ApiResponse } from "../types/common.types";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto,
  TipoEvidenciaDto
} from "../types/evidencias.types";

export interface EvidenciasPageParams {
  currentPage?: number;
  pageSize?: number;
  currentpage?: number;
  pagesize?: number;
  parameter?: string;
  filter?: string;
}

function buildPageParams(params?: EvidenciasPageParams) {
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

export const evidenciasService = {
  tipos: {
    health: () =>
      http.get<string>("/api/evidencias/tipos/health"),

    getAll: () =>
      http.get<ApiResponse<TipoEvidenciaDto>>(
        "/api/evidencias/tipos/all"
      ),

    getPages: (params?: EvidenciasPageParams) =>
      http.get<ApiResponse<TipoEvidenciaDto>>(
        "/api/evidencias/tipos/pages",
        { params: buildPageParams(params) }
      ),

    get: (id: number) =>
      http.get<TipoEvidenciaDto>(
        `/api/evidencias/tipos/get/${id}`
      ),

    getByKey: (tipoEvidenciaKey: string) =>
      http.get<TipoEvidenciaDto>(
        "/api/evidencias/tipos/by-key",
        { params: { tipoEvidenciaKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<TipoEvidenciaDto>>(
        "/api/evidencias/tipos/by-estado",
        { params: { estado } }
      ),

    create: (data: TipoEvidenciaDto) =>
      http.post<TipoEvidenciaDto>(
        "/api/evidencias/tipos/create",
        data
      ),

    createList: (data: TipoEvidenciaDto[]) =>
      http.post<TipoEvidenciaDto[]>(
        "/api/evidencias/tipos/create-list",
        data
      ),

    update: (id: number, data: TipoEvidenciaDto) =>
      http.put<TipoEvidenciaDto>(
        `/api/evidencias/tipos/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<TipoEvidenciaDto>(
        `/api/evidencias/tipos/changestatus/${id}`,
        null,
        { params: { estado } }
      ),

    delete: (id: number) =>
      http.delete<void>(
        `/api/evidencias/tipos/delete/${id}`
      )
  },

  evidencias: {
    health: () =>
      http.get<string>("/api/evidencias/evidencias/health"),

    getAll: () =>
      http.get<ApiResponse<EvidenciaDto>>(
        "/api/evidencias/evidencias/all"
      ),

    getPages: (params?: EvidenciasPageParams) =>
      http.get<ApiResponse<EvidenciaDto>>(
        "/api/evidencias/evidencias/pages",
        { params: buildPageParams(params) }
      ),

    get: (id: number) =>
      http.get<EvidenciaDto>(
        `/api/evidencias/evidencias/get/${id}`
      ),

    getByKey: (evidenciaKey: string) =>
      http.get<EvidenciaDto>(
        "/api/evidencias/evidencias/by-key",
        { params: { evidenciaKey } }
      ),

    getByTipo: (tipoEvidenciaKey: string) =>
      http.get<ApiResponse<EvidenciaDto>>(
        "/api/evidencias/evidencias/by-tipo",
        { params: { tipoEvidenciaKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<EvidenciaDto>>(
        "/api/evidencias/evidencias/by-estado",
        { params: { estado } }
      ),

    create: (data: EvidenciaDto) =>
      http.post<EvidenciaDto>(
        "/api/evidencias/evidencias/create",
        data
      ),

    createList: (data: EvidenciaDto[]) =>
      http.post<EvidenciaDto[]>(
        "/api/evidencias/evidencias/create-list",
        data
      ),

    update: (id: number, data: EvidenciaDto) =>
      http.put<EvidenciaDto>(
        `/api/evidencias/evidencias/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<EvidenciaDto>(
        `/api/evidencias/evidencias/changestatus/${id}`,
        null,
        { params: { estado } }
      ),

    delete: (id: number) =>
      http.delete<void>(
        `/api/evidencias/evidencias/delete/${id}`
      )
  },

  referencias: {
    health: () =>
      http.get<string>("/api/evidencias/referencias/health"),

    getAll: () =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/all"
      ),

    getPages: (params?: EvidenciasPageParams) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/pages",
        { params: buildPageParams(params) }
      ),

    get: (id: number) =>
      http.get<ReferenciaEvidenciaDto>(
        `/api/evidencias/referencias/get/${id}`
      ),

    getByKey: (referenciaKey: string) =>
      http.get<ReferenciaEvidenciaDto>(
        "/api/evidencias/referencias/by-key",
        { params: { referenciaKey } }
      ),

    getByEvidencia: (evidenciaKey: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/by-evidencia",
        { params: { evidenciaKey } }
      ),

    getByRegistro: (registroKey: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/by-registro",
        { params: { registroKey } }
      ),

    getByTipoRegistro: (tipoRegistro: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/by-tipo-registro",
        { params: { tipoRegistro } }
      ),

    getByTipoRegistroAndRegistro: (
      tipoRegistro: string,
      registroKey: string
    ) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/by-tipo-registro-and-registro",
        { params: { tipoRegistro, registroKey } }
      ),

    getByEstado: (estado: string) =>
      http.get<ApiResponse<ReferenciaEvidenciaDto>>(
        "/api/evidencias/referencias/by-estado",
        { params: { estado } }
      ),

    create: (data: ReferenciaEvidenciaDto) =>
      http.post<ReferenciaEvidenciaDto>(
        "/api/evidencias/referencias/create",
        data
      ),

    createList: (data: ReferenciaEvidenciaDto[]) =>
      http.post<ReferenciaEvidenciaDto[]>(
        "/api/evidencias/referencias/create-list",
        data
      ),

    update: (id: number, data: ReferenciaEvidenciaDto) =>
      http.put<ReferenciaEvidenciaDto>(
        `/api/evidencias/referencias/update/${id}`,
        data
      ),

    changeStatus: (id: number, estado: string) =>
      http.patch<ReferenciaEvidenciaDto>(
        `/api/evidencias/referencias/changestatus/${id}`,
        null,
        { params: { estado } }
      ),

    delete: (id: number) =>
      http.delete<void>(
        `/api/evidencias/referencias/delete/${id}`
      )
  }
};