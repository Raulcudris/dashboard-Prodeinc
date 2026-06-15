import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiErrorResponse } from "../types/common.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

function getFriendlyError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    const status = axiosError.response?.status;
    const backendMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.rspMessage ||
      axiosError.message;

    if (status === 404) {
      return {
        status,
        message: "No se encontraron registros para la consulta realizada.",
        detail: backendMessage
      };
    }

    if (status === 500) {
      return {
        status,
        message:
          "No fue posible cargar los datos. Verifica que el microservicio esté activo.",
        detail: backendMessage
      };
    }

    return {
      status,
      message: backendMessage || "Ocurrió un error inesperado.",
      detail: axiosError.response?.data
    };
  }

  return {
    message: "Ocurrió un error inesperado en la aplicación.",
    detail: error
  };
}

apiClient.interceptors.response.use(
  response => response,
  error => {
    const friendlyError = getFriendlyError(error);

    if (friendlyError.status !== 404) {
      console.error("API Error:", friendlyError);
    }

    return Promise.reject(friendlyError);
  }
);

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then(response => response.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then(response => response.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then(response => response.data)
};