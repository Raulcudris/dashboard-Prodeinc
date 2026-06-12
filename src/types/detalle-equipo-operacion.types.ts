export interface DetalleEquipoOperacionDto {
  orsPrimarykeyDeop?: number;

  orsIdentifkeyDeop?: string;
  orsIdentifkeyRope?: string;
  orsIdentifkeyOrde?: string;
  orsIdentifkeyPsem?: string;
  orsIdentifkeyPlse?: string;
  orsIdentifkeyPunt?: string;

  prvIdentifkeyInve?: string;
  prvTipoequipoTieq?: string;

  orsNombrequipoDeop?: string;
  orsRefermodeloDeop?: string;
  orsNroregistroDeop?: string;

  orsUnidadDeop?: string;
  orsTipocontrolDeop?: string;
  orsFechatrabajoDeop?: string;

  orsHorometroiniDeop?: number;
  orsHorometrofinDeop?: number;

  orsKminicialDeop?: number;
  orsKmfinalDeop?: number;

  orsDiatrabajadoDeop?: number;
  orsValorunidadDeop?: number;

  orsObservacionDeop?: string;

  orsFirmasuministroDeop?: string;
  orsFirmaseguimientoDeop?: string;

  orsTiporegistDeop?: string;
  orsEstadoregDeop?: string;
}