export interface UnidadMedidaDto {
  prvTipunidamedUnme?: string;
  prvDescmedidaUnme?: string;
  prvEstadoregUnme?: string;
}

export interface TipoEquipoDto {
  prvPrimarykeyTieq?: number;
  prvTipoequipoTieq?: string;
  prvDescripcionTieq?: string;
  prvIdentifkeyUnme?: string;
  prvTiporegistTieq?: string;
  prvEstadoregTieq?: string;
}

export interface EquipoDto {
  prvPrimarykeyInve?: number;
  prvIdentifkeyInve?: string;
  prvIdentifkeyMprv?: string;
  prvTipoequipoTieq?: string;
  prvNombrequipoInve?: string;
  prvRefermodeloInve?: string;
  prvEquipoestadoInve?: string;
  prvEquipoactivoInve?: string;
  prvEstadoregInve?: string;
  prvDescripcionInve?: string;
}