import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import {
  ActaModificacionDetalleDto,
  ActaModificacionDto
} from "../types/controlObras.types";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto
} from "../types/evidencias.types";

function sameKey(value?: string, key?: string) {
  return (
    String(value ?? "")
      .trim()
      .toLowerCase() ===
    String(key ?? "")
      .trim()
      .toLowerCase()
  );
}

async function getPageData<T>(
  loader: () => Promise<{ rspData?: T[] }>
): Promise<T[]> {
  try {
    const response = await loader();
    return (response.rspData ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

export interface ActaModificacionTraceabilityData {
  actaModificacion: ActaModificacionDto | null;
  detalles: ActaModificacionDetalleDto[];
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const actaModificacionTraceabilityService = {
  async getByActaModificacion(
    actaModificacionKey: string
  ): Promise<ActaModificacionTraceabilityData> {
    const [actas, detalles, referencias, evidencias] = await Promise.all([
      getPageData(() =>
        controlObrasService.actasModificacion.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        controlObrasService.actasModificacionDetalles.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        evidenciasService.referencias.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        evidenciasService.evidencias.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      )
    ]);

    const actaModificacion =
      actas.find(row => sameKey(row.orsIdentifkeyAcmo, actaModificacionKey)) ??
      null;

    const detallesActa = detalles.filter(row =>
      sameKey(row.orsIdentifkeyAcmo, actaModificacionKey)
    );

    const detalleKeys = detallesActa
      .map(row => row.orsIdentifkeyAcdt)
      .filter(Boolean);

    const referenciasActa = referencias.filter(row => {
      const registroRelacionado = row.eviIdentifregistroRefe;

      return (
        sameKey(registroRelacionado, actaModificacionKey) ||
        detalleKeys.some(key => sameKey(registroRelacionado, key))
      );
    });

    const evidenciaKeys = referenciasActa
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasActa = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      actaModificacion,
      detalles: detallesActa,
      referencias: referenciasActa,
      evidencias: evidenciasActa
    };
  }
};