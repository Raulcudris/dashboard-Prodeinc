export interface ApiPagination {
  currentPage: number;
  totalPageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  rspValue?: string;
  rspMessage?: string;
  rspParentKey?: string;
  rspAppKey?: string;
  rspPagination?: ApiPagination;
  rspData: T[];
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
  detail?: unknown;
}

export type EstadoRegistro = "1" | "2";

export interface PageParams {
  currentPage?: number;
  pageSize?: number;
  currentpage?: number;
  pagesize?: number;
  parameter?: string;
  filter?: string;
}

export interface ChangeStatusRequest {
  recPKey: number | string;
  recEstreg: string;
}

export interface DeleteRequest {
  recPKey: number | string;
}

export function buildApiWrapper<T>(data: T | T[]): ApiResponse<T> {
  return {
    rspValue: "",
    rspMessage: "",
    rspParentKey: "",
    rspAppKey: "",
    rspData: Array.isArray(data) ? data : [data]
  };
}

export function buildPageParams(params?: PageParams) {
  const currentPage = params?.currentPage ?? params?.currentpage ?? 1;
  const pageSize = params?.pageSize ?? params?.pagesize ?? 10;

  return {
    currentpage: currentPage,
    pagesize: pageSize,
    currentPage,
    pageSize,
    parameter: params?.parameter ?? "TEXT",
    filter: params?.filter ?? ""
  };
}