import { create } from "zustand";

export interface FlujoObraKeys {
  // Administración base
  proveedorKey?: string;
  unidadKey?: string;
  tipoEquipoKey?: string;
  equipoKey?: string;

  // Planeación de obra
  ordenKey?: string;
  resumenEquipoKey?: string;
  puntoKey?: string;
  proyeccionKey?: string;
  planKey?: string;
  planSemanalKey?: string;

  // Flujo anterior / compatibilidad
  reporteKey?: string;

  // Ejecución diaria real
  reporteOperacionKey?: string;
  detalleEquipoOperacionKey?: string;

  // Soportes
  novedadKey?: string;
  evidenciaKey?: string;
  referenciaKey?: string;

  // Seguimiento
  informeSemanalKey?: string;

  // Modificaciones
  actaModificacionKey?: string;
  detalleActaModificacionKey?: string;
}

interface FlujoObraState extends FlujoObraKeys {
  setKey: (key: keyof FlujoObraKeys, value: string) => void;
  setMany: (values: Partial<FlujoObraKeys>) => void;
  reset: () => void;
}

const initialState: FlujoObraKeys = {
  proveedorKey: "",
  unidadKey: "",
  tipoEquipoKey: "",
  equipoKey: "",

  ordenKey: "",
  resumenEquipoKey: "",
  puntoKey: "",
  proyeccionKey: "",
  planKey: "",
  planSemanalKey: "",

  reporteKey: "",

  reporteOperacionKey: "",
  detalleEquipoOperacionKey: "",

  novedadKey: "",
  evidenciaKey: "",
  referenciaKey: "",

  informeSemanalKey: "",

  actaModificacionKey: "",
  detalleActaModificacionKey: ""
};

export const useFlujoObraStore = create<FlujoObraState>(set => ({
  ...initialState,

  setKey: (key, value) =>
    set({
      [key]: value
    }),

  setMany: values =>
    set({
      ...values
    }),

  reset: () =>
    set({
      ...initialState
    })
}));