import { EstadoRegistro } from "./common.types";

export interface UnidadMedidaDto {
  prvTipunidamedUnme?: string;
  prvDescmedidaUnme?: string;
  prvEstadoregUnme?: EstadoRegistro;
}

export interface TipoEquipoDto {
  prvPrimarykeyTieq?: number;
  prvTipoequipoTieq?: string;
  prvDescripcionTieq?: string;
  prvIdentifkeyUnme?: string;
  prvTiporegistTieq?: string;
  prvEstadoregTieq?: EstadoRegistro;
}

export interface EquipoDto {
  prvPrimarykeyInve?: number;
  prvIdentifkeyInve?: string;
  prvIdentifkeyMprv?: string;
  prvTipoequipoTieq?: string;
  prvNombrequipoInve?: string;
  prvRefermodeloInve?: string;
  prvEquipoestadoInve?: string;
  prvEquipoactivoInve?: EstadoRegistro;
  prvEstadoregInve?: EstadoRegistro;
  prvDescripcionInve?: string;
}