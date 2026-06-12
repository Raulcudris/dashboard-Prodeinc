export interface OrdenServicioDto {
  orsPrimarykeyOrde?: number;
  orsIdentifkeyOrde: string;
  orsAutorifechaOrde: string;
  orsCodservicioSebs: string;
  orsServiceventOrde: string;
  orsServiclugarOrde: string;
  orsServicobjetoOrde: string;
  orsPlanfechiniOrde: string;
  orsPlanfechfinOrde: string;
  prvIdentifkeyMprv: string;
  prvIdentifkeyRelg?: string | null;
  orsValorbaseOrde: number;
  orsValordeivaOrde: number;
  orsValortotalOrde: number;
  orsTiporegistOrde?: string;
  orsEstadoregOrde?: string;
}

export interface ResumenEquipoDto {
  orsPrimarykeyRseq?: number;
  orsIdentifkeyRseq: string;
  orsIdentifkeyOrde: string;
  prvTipoequipoTieq: string;
  orsCantidunidadRseq: number;
  orsValorunidadRseq: number;
  orsValortotalRseq: number;
  orsTiporegistRseq?: string;
  orsEstadoregRseq?: string;
}

export interface SitioPuntoDto {
  orsPrimarykeyPunt?: number;
  orsIdentifkeyPunt: string;
  orsIdentifkeyOrde: string;
  orsNombresitioPunt: string;
  sisCodproSipr?: string;
  orsGeolatitudePunt?: number;
  orsGeolongitudePunt?: number;
  orsPathimagenPunt?: string;
  orsTiporegistPunt?: string;
  orsEstadoregPunt?: string;
}

export interface ProyeccionSemanalDto {
  orsPrimarykeyPsem?: number;
  orsIdentifkeyPsem: string;
  orsIdentifkeyOrde: string;
  orsNumerosemPsem: number;
  orsTitulosemPsem: string;
  orsSemfechiniPsem: string;
  orsSemfechfinPsem: string;
  orsDiashabilesPsem?: string;
  orsDiasnhabilesPsem?: string;
  orsTiporegistPsem?: string;
  orsEstadoregPsem?: string;
}

export interface PlanTrabajoDto {
  orsPrimarykeyPltr?: number;
  orsIdentifkeyPltr: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPunt: string;
  orsDesactividadPltr: string;
  orsIdentifkeyRseq: string;
  prvIdentifkeyInve: string;
  orsCantidunidadRseq: number;
  orsValorunidadRseq: number;
  orsValortotalRseq: number;
  orsTiporegistPltr?: string;
  orsEstadoregPltr?: string;
}

export interface PlanSemanalDto {
  orsPrimarykeyPlse?: number;
  orsIdentifkeyPlse: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPltr: string;
  orsIdentifkeyPsem: string;
  orsCantidunidadPlse: number;
  orsValorunidadPlse: number;
  orsValortotalPlse: number;
  orsEjecutunidadPlse: number;
  orsValorejecutPlse: number;
  orsTiporegistPlse?: string;
  orsEstadoregPlse?: string;
}

export interface ReporteDiarioDto {
  orsPrimarykeyPdia?: number;
  orsIdentifkeyPdia: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPsem: string;
  orsObservacionPdia?: string;
  orsFechareportPdia: string;
  orsEjecutunidadPdia: number;
  orsFechasistemaPdia?: string;
  orsTiporegistPdia?: string;
  orsEstadoregPdia?: string;
}

export interface NovedadDto {
  orsPrimarykeyNove?: number;
  orsIdentifkeyNove: string;
  orsIdentifkeyOrde: string;
  orsFechreportNove: string;
  orsTiponovedadNovt: string;
  orsRegistrbaseNove: string;
  orsRegistrnoveNove: string;
  orsEstadoregNove?: string;
}

export interface AvanceObraDto {
  ordenKey?: string;
  planKey?: string;
  planSemanalKey?: string;

  orsIdentifkeyOrde?: string;
  orsIdentifkeyPltr?: string;
  orsIdentifkeyPlse?: string;

  cantidadPlaneadaTotal?: number;
  cantidadEjecutadaTotal?: number;
  cantidadPendiente?: number;

  valorPlaneadoTotal?: number;
  valorEjecutadoTotal?: number;
  valorPendiente?: number;

  porcentajeAvance?: number;
  estadoAvance?: string;

  [key: string]: unknown;
}

export interface PaginationResponse {
  currentPage?: number;
  totalPageSize?: number;
  totalResults?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPageUrl?: string;
  previousPageUrl?: string;
}

export interface ApiResponse<T> {
  rspMessage?: string;
  rspValue?: string;
  rspParentKey?: string;
  rspAppKey?: string;
  rspPagination?: PaginationResponse;
  rspData?: T[];
}

export interface ReporteOperacionDto {
  orsPrimarykeyRope?: number;
  orsIdentifkeyRope?: string;
  orsIdentifkeyOrde?: string;
  orsIdentifkeyPsem?: string;
  orsIdentifkeyPlse?: string;
  orsIdentifkeyPunt?: string;
  orsFechareportRope?: string;
  orsDepartamentoRope?: string;
  orsMunicipioRope?: string;
  orsSitioRope?: string;
  prvIdentifkeyMprv?: string;
  orsSemanaRope?: number;
  orsSemfechiniRope?: string;
  orsSemfechfinRope?: string;
  orsDescsuministroRope?: string;
  orsActividadhidraulicaRope?: string;
  orsActividadjarillonesRope?: string;
  orsActividadtaludesRope?: string;
  orsActividadviasRope?: string;
  orsActividadotroRope?: string | null;
  orsObservacionRope?: string;
  orsFirmasuministroRope?: string;
  orsFirmaseguimientoRope?: string;
  orsFechasistemaRope?: string;
  orsTiporegistRope?: string;
  orsEstadoregRope?: string;
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
  orsHorometroiniDeop?: number;
  orsHorometrofinDeop?: number;
  orsHorastrabajadasDeop?: number;
  orsKminicialDeop?: number;
  orsKmfinalDeop?: number;
  orsKmrecorridoDeop?: number;
  orsDiatrabajadoDeop?: number;
  orsValorunidadDeop?: number;
  orsValorejecutadoDeop?: number;
  orsFechatrabajoDeop?: string;
  orsObservacionDeop?: string;
  orsFirmasuministroDeop?: string;
  orsFirmaseguimientoDeop?: string;
  orsFechasistemaDeop?: string;
  orsTiporegistDeop?: string;
  orsEstadoregDeop?: string;
}

export interface InformeSemanalDto {
  orsPrimarykeyInse?: number;
  orsIdentifkeyInse?: string;
  orsIdentifkeyOrde?: string;
  orsIdentifkeyPsem?: string;
  orsSemanaInse?: number;
  orsFechainicioInse?: string;
  orsFechafinInse?: string;
  orsValorordenInse?: number;
  orsProgramadosemanaInse?: number;
  orsEjecutadosemanaInse?: number;
  orsProgramadoacumuladoInse?: number;
  orsEjecutadoacumuladoInse?: number;
  orsCantidadprogramadasemInse?: number;
  orsCantidadejecutadasemInse?: number;
  orsCantidadprogramadaacuInse?: number;
  orsCantidadejecutadaacuInse?: number;
  orsPoravancefisicoInse?: number;
  orsPoravancefinancieroInse?: number;
  orsAtrasoadelantoInse?: number;
  orsEstadoavanceInse?: string;
  orsObservacionInse?: string;
  orsFechasistemaInse?: string;
  orsTiporegistInse?: string;
  orsEstadoregInse?: string;
}

export interface ActaModificacionDto {
  orsPrimarykeyAcmo?: number;
  orsIdentifkeyAcmo?: string;
  orsIdentifkeyOrde?: string;
  orsNumeroactaAcmo?: string;
  orsFechaactaAcmo?: string;
  orsTipomodificacionAcmo?: string;
  orsCausalAcmo?: string;
  orsValorinicialAcmo?: number;
  orsValormodificacionAcmo?: number;
  orsValoractualizadoAcmo?: number;
  orsSaldoaliberarAcmo?: number;
  orsEstadoactaAcmo?: string;
  orsFechasistemaAcmo?: string;
  orsTiporegistAcmo?: string;
  orsEstadoregAcmo?: string;
}

export interface ActaModificacionDetalleDto {
  orsPrimarykeyAcmd?: number;
  orsIdentifkeyAcmd?: string;
  orsIdentifkeyAcmo?: string;
  orsIdentifkeyOrde?: string;
  orsIdentifkeyRseq?: string;
  prvTipoequipoTieq?: string;
  orsDescripcionEquipoAcmd?: string;
  orsUnidadAcmd?: string;
  orsCantidadoriginalAcmd?: number;
  orsValorunitarioAcmd?: number;
  orsValororiginalAcmd?: number;
  orsCantidadanteriorAcmd?: number;
  orsValoranteriorAcmd?: number;
  orsCantidadmodificadaAcmd?: number;
  orsValormodificadoAcmd?: number;
  orsCantidadactualizadaAcmd?: number;
  orsValoractualizadoAcmd?: number;
  orsObservacionAcmd?: string;
  orsFechasistemaAcmd?: string;
  orsTiporegistAcmd?: string;
  orsEstadoregAcmd?: string;
}