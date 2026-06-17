import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../types/common.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

function getBackendMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const record = data as Record<string, unknown>;

  if (typeof record.message === "string") return record.message;
  if (typeof record.error === "string") return record.error;
  if (typeof record.rspMessage === "string") return record.rspMessage;
  if (typeof record.detail === "string") return record.detail;

  return undefined;
}

http.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const backendMessage = getBackendMessage(error.response?.data);

    const friendlyError: ApiErrorResponse = {
      status,
      message:
        backendMessage ||
        "No fue posible cargar los datos. Verifica que el microservicio esté activo.",
      detail: error.response?.data
    };

    if (status !== 404) {
      console.error("API Error:", friendlyError);
    }

    return Promise.reject(friendlyError);
  }
);