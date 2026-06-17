import { EstadoRegistro } from "./common.types";

export interface TipoEvidenciaDto {
  eviPrimarykeyTiev?: number;
  eviIdentifkeyTiev?: string;
  eviDescripcionTiev?: string;
  eviTiporegistTiev?: string;
  eviEstadoregTiev?: EstadoRegistro;
}

export interface EvidenciaDto {
  eviPrimarykeyEvid?: number;
  eviIdentifkeyEvid?: string;
  eviIdentifkeyTiev?: string;
  eviNombrearchivoEvid?: string;
  eviDescripcionEvid?: string;
  eviUrlarchivoEvid?: string;
  eviFechacapturaEvid?: string;
  eviLatitudEvid?: number;
  eviLongitudEvid?: number;
  eviTiporegistEvid?: string;
  eviEstadoregEvid?: EstadoRegistro;
}

export interface ReferenciaEvidenciaDto {
  eviPrimarykeyRefe?: number;
  eviIdentifkeyRefe?: string;
  eviIdentifkeyEvid?: string;
  eviTiporegistroRefe?: TipoRegistroEvidencia | string;
  eviIdentifregistroRefe?: string;
  eviObservacionRefe?: string;
  eviTiporegistRefe?: string;
  eviEstadoregRefe?: EstadoRegistro;
}

export type TipoRegistroEvidencia =
  | "REPORTE_OPERACION"
  | "NOVEDAD"
  | "DETALLE_EQUIPO_OPERACION"
  | "INFORME_SEMANAL"
  | "ACTA_MODIFICACION"
  | "DETALLE_ACTA_MODIFICACION"
  | "ORDEN_SERVICIO"
  | "SITIO_PUNTO"
  | "PLAN_TRABAJO"
  | "PLAN_SEMANAL";