import {
  ApiResponse,
  ChangeStatusRequest,
  DeleteRequest,
  PageParams,
  buildApiWrapper,
  buildPageParams
} from "../types/common.types";
import { http } from "./apiClient";

export interface CrudService<T> {
  health: () => Promise<string>;
  getPages: (params?: PageParams) => Promise<ApiResponse<T>>;
  getAll: () => Promise<ApiResponse<T>>;
  get: (id: number | string) => Promise<T>;
  getByKey: (key: string) => Promise<ApiResponse<T>>;
  create: (data: T) => Promise<ApiResponse<T>>;
  update: (id: number | string, data: T) => Promise<ApiResponse<T>>;
  changeStatus: (
    recPKey: number | string,
    recEstreg: string
  ) => Promise<ApiResponse<T>>;
  delete: (recPKey: number | string) => Promise<ApiResponse<T>>;
}

export function buildChangeStatusPayload(
  recPKey: number | string,
  recEstreg: string
): ChangeStatusRequest[] {
  return [
    {
      recPKey,
      recEstreg
    }
  ];
}

export function buildDeletePayload(
  recPKey: number | string
): DeleteRequest[] {
  return [
    {
      recPKey
    }
  ];
}

export function createCrudService<T>(
  baseUrl: string,
  keyParamName = "key"
): CrudService<T> {
  return {
    async health() {
      const response = await http.get<string>(`${baseUrl}/health`);
      return response.data;
    },

    async getPages(params?: PageParams) {
      const response = await http.get<ApiResponse<T>>(`${baseUrl}/pages`, {
        params: buildPageParams(params)
      });

      return response.data;
    },

    async getAll() {
      const response = await http.get<ApiResponse<T>>(`${baseUrl}/all`);
      return response.data;
    },

    async get(id: number | string) {
      const response = await http.get<T>(`${baseUrl}/get/${id}`);
      return response.data;
    },

    async getByKey(key: string) {
      const response = await http.get<ApiResponse<T>>(`${baseUrl}/by-key`, {
        params: {
          [keyParamName]: key
        }
      });

      return response.data;
    },

    async create(data: T) {
      const response = await http.post<ApiResponse<T>>(
        `${baseUrl}/create`,
        buildApiWrapper(data)
      );

      return response.data;
    },

    async update(id: number | string, data: T) {
      const response = await http.put<ApiResponse<T>>(
        `${baseUrl}/update/${id}`,
        buildApiWrapper(data)
      );

      return response.data;
    },

    async changeStatus(recPKey: number | string, recEstreg: string) {
      const response = await http.post<ApiResponse<T>>(
        `${baseUrl}/changestatus`,
        buildChangeStatusPayload(recPKey, recEstreg)
      );

      return response.data;
    },

    async delete(recPKey: number | string) {
      const response = await http.post<ApiResponse<T>>(
        `${baseUrl}/delete`,
        buildDeletePayload(recPKey)
      );

      return response.data;
    }
  };
}