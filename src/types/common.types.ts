export interface ApiPagination {
  currentPage: number;
  totalPageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  rspMessage: string;
  rspValue: string;
  rspParentKey: string;
  rspAppKey: string;
  rspPagination?: ApiPagination;
  rspData: T[];
}

export type EstadoRegistro = "1" | "2";

export interface ApiErrorResponse {
  message: string;
  status?: number;
  detail?: unknown;
}