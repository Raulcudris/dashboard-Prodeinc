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

export interface ActaModificacionDetalleTraceabilityData {
  detalle: ActaModificacionDetalleDto | null;
  actaModificacion: ActaModificacionDto | null;
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const actaModificacionDetalleTraceabilityService = {
  async getByDetalleActa(
    actaDetalleKey: string
  ): Promise<ActaModificacionDetalleTraceabilityData> {
    const [detalles, actas, referencias, evidencias] = await Promise.all([
      getPageData(() =>
        controlObrasService.actasModificacionDetalles.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        controlObrasService.actasModificacion.getPages({
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

    const detalle =
      detalles.find(row => sameKey(row.orsIdentifkeyAcdt, actaDetalleKey)) ??
      null;

    const actaModificacion =
      actas.find(row =>
        sameKey(row.orsIdentifkeyAcmo, detalle?.orsIdentifkeyAcmo)
      ) ?? null;

    const referenciasDetalle = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, actaDetalleKey)
    );

    const evidenciaKeys = referenciasDetalle
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasDetalle = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      detalle,
      actaModificacion,
      referencias: referenciasDetalle,
      evidencias: evidenciasDetalle
    };
  }
};