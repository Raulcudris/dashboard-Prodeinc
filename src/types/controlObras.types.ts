import { EstadoRegistro } from "./common.types";

export interface ServicioBasicoDto {
  orsCodservicioSebs: string;
  orsDesservicioSebs?: string;
  orsEstadoregSebs?: EstadoRegistro;
}

export interface OrdenServicioDto {
  orsPrimarykeyOrde?: number;
  orsIdentifkeyOrde: string;
  orsAutorifechaOrde?: string;
  orsCodservicioSebs?: string;
  orsServiceventOrde?: string;
  orsServiclugarOrde?: string;
  orsServicobjetoOrde?: string;
  orsPlanfechiniOrde?: string;
  orsPlanfechfinOrde?: string;
  prvIdentifkeyMprv?: string;
  prvIdentifkeyRelg?: string | null;
  orsValorbaseOrde?: number;
  orsValordeivaOrde?: number;
  orsValortotalOrde?: number;
  orsTiporegistOrde?: string;
  orsEstadoregOrde?: EstadoRegistro;
}

export interface SitioPuntoDto {
  orsPrimarykeyPunt?: number;
  orsIdentifkeyPunt: string;
  orsIdentifkeyOrde: string;
  orsNombresitioPunt: string;
  sisCodproSipr?: string;
  orsGeolatitudePunt?: number | string;
  orsGeolongitudePunt?: number | string;
  orsPathimagenPunt?: string;
  orsTiporegistPunt?: string;
  orsEstadoregPunt?: EstadoRegistro;
}

export interface ProyeccionDto {
  orsPrimarykeyPsem?: number;
  orsIdentifkeyPsem: string;
  orsIdentifkeyOrde?: string;
  orsNumsemanaPsem?: number;
  orsFechainicioPsem?: string;
  orsFechafinPsem?: string;
  orsDescripcionPsem?: string;
  orsTiporegistPsem?: string;
  orsEstadoregPsem?: EstadoRegistro;
}

export interface PlanTrabajoDto {
  orsPrimarykeyPltr?: number;
  orsIdentifkeyPltr: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPunt: string;
  orsDesactividadPltr?: string;
  orsIdentifkeyRseq?: string;
  prvIdentifkeyInve?: string;
  orsCantidunidadRseq?: number;
  orsValorunidadRseq?: number;
  orsValortotalRseq?: number;
  orsTiporegistPltr?: string;
  orsEstadoregPltr?: EstadoRegistro;
}

export interface PlanSemanalDto {
  orsPrimarykeyPlse?: number;
  orsIdentifkeyPlse: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPltr: string;
  orsIdentifkeyPsem: string;
  orsCantidunidadPlse?: number;
  orsValorunidadPlse?: number;
  orsValortotalPlse?: number;
  orsEjecutunidadPlse?: number;
  orsValorejecutPlse?: number;
  orsTiporegistPlse?: string;
  orsEstadoregPlse?: EstadoRegistro;
}

export interface ReporteDiarioDto {
  orsPrimarykeyPdia?: number;
  orsIdentifkeyPdia: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPsem?: string;
  orsObservacionPdia?: string;
  orsFechareportPdia?: string;
  orsEjecutunidadPdia?: number;
  orsTiporegistPdia?: string;
  orsEstadoregPdia?: EstadoRegistro;
}

export interface TipoNovedadDto {
  orsPrimarykeyNovt?: number;
  orsTiponovedadNovt: string;
  orsDescripcionNovt?: string;
  orsEstadoregNovt?: EstadoRegistro;
}

export interface NovedadDto {
  orsPrimarykeyNove?: number;
  orsIdentifkeyNove: string;
  orsIdentifkeyOrde: string;
  orsFechreportNove?: string;
  orsTiponovedadNovt?: string;
  orsRegistrbaseNove?: string;
  orsRegistbaseNove?: string;
  orsRegistrnoveNove?: string;
  orsEstadoregNove?: EstadoRegistro;
}

export interface ReporteOperacionDto {
  orsPrimarykeyRope?: number;
  orsIdentifkeyRope: string;
  orsIdentifkeyOrde: string;
  orsFechareportRope?: string;
  orsObservacionRope?: string;
  orsTiporegistRope?: string;
  orsEstadoregRope?: EstadoRegistro;
}

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
  orsEstadoregDeop?: EstadoRegistro;
}

export interface ResumenEquipoDto {
  orsPrimarykeyRseq?: number;
  orsIdentifkeyRseq: string;
  orsIdentifkeyOrde?: string;
  prvIdentifkeyInve?: string;
  orsCantidadRseq?: number;
  orsValorunidadRseq?: number;
  orsValortotalRseq?: number;
  orsEstadoregRseq?: EstadoRegistro;
}

export interface AvanceObraDto {
  [key: string]: unknown;
}

export interface InformeSemanalDto {
  orsPrimarykeyInse?: number;
  orsIdentifkeyInse?: string;

  orsIdentifkeyOrde?: string;
  orsIdentifkeyPsem?: string;
  orsIdentifkeyPlse?: string;

  orsFechainicioInse?: string;
  orsFechafinInse?: string;
  orsDescripcionInse?: string;
  orsObservacionInse?: string;

  orsAvanceprogramadoInse?: number;
  orsAvanceejecutadoInse?: number;
  orsPorccumplimientoInse?: number;

  orsTiporegistInse?: string;
  orsEstadoregInse?: EstadoRegistro;
}

export interface ActaModificacionDto {
  orsPrimarykeyAcmo?: number;
  orsIdentifkeyAcmo?: string;

  orsIdentifkeyOrde?: string;
  orsNumeroactaAcmo?: string;
  orsFechaactaAcmo?: string;

  orsTipoactaAcmo?: string;
  orsConceptoAcmo?: string;
  orsDescripcionAcmo?: string;
  orsJustificacionAcmo?: string;

  orsValoractualAcmo?: number;
  orsValormodificadoAcmo?: number;
  orsValortotalAcmo?: number;

  orsFechainicioActualAcmo?: string;
  orsFechafinActualAcmo?: string;
  orsFechainicioNuevaAcmo?: string;
  orsFechafinNuevaAcmo?: string;

  orsObservacionAcmo?: string;
  orsTiporegistAcmo?: string;
  orsEstadoregAcmo?: EstadoRegistro;
}

export interface ActaModificacionDetalleDto {
  orsPrimarykeyAcdt?: number;
  orsIdentifkeyAcdt?: string;

  orsIdentifkeyAcmo?: string;
  orsIdentifkeyOrde?: string;
  orsIdentifkeyPltr?: string;
  orsIdentifkeyPlse?: string;
  orsIdentifkeyPunt?: string;

  orsDescripcionAcdt?: string;
  orsUnidadAcdt?: string;

  orsCantidadactualAcdt?: number;
  orsCantidadmodificadaAcdt?: number;
  orsValorunidadAcdt?: number;
  orsValoractualAcdt?: number;
  orsValormodificadoAcdt?: number;
  orsValortotalAcdt?: number;

  orsObservacionAcdt?: string;
  orsTiporegistAcdt?: string;
  orsEstadoregAcdt?: EstadoRegistro;
}