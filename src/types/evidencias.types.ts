export interface TipoEvidenciaDto {
  eviPrimarykeyTiev?: number;
  eviIdentifkeyTiev?: string;
  eviDescripcionTiev?: string;
  eviTiporegistTiev?: string;
  eviEstadoregTiev?: string;
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
  eviEstadoregEvid?: string;
}

export interface ReferenciaEvidenciaDto {
  eviPrimarykeyRefe?: number;
  eviIdentifkeyRefe?: string;
  eviIdentifkeyEvid?: string;
  eviTiporegistroRefe?: string;
  eviIdentifregistroRefe?: string;
  eviObservacionRefe?: string;
  eviTiporegistRefe?: string;
  eviEstadoregRefe?: string;
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