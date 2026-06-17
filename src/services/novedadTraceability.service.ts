import { controlObrasService } from "./controlObras.service";
import { evidenciasService } from "./evidencias.service";
import { NovedadDto } from "../types/controlObras.types";
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

export interface NovedadTraceabilityData {
  novedad: NovedadDto | null;
  referencias: ReferenciaEvidenciaDto[];
  evidencias: EvidenciaDto[];
}

export const novedadTraceabilityService = {
  async getByNovedad(novedadKey: string): Promise<NovedadTraceabilityData> {
    const [novedades, referencias, evidencias] = await Promise.all([
      getPageData(() =>
        controlObrasService.novedades.getPages({
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

    const novedad =
      novedades.find(row => sameKey(row.orsIdentifkeyNove, novedadKey)) ??
      null;

    const referenciasNovedad = referencias.filter(row =>
      sameKey(row.eviIdentifregistroRefe, novedadKey)
    );

    const evidenciaKeys = referenciasNovedad
      .map(row => row.eviIdentifkeyEvid)
      .filter(Boolean);

    const evidenciasNovedad = evidencias.filter(row =>
      evidenciaKeys.some(key => sameKey(row.eviIdentifkeyEvid, key))
    );

    return {
      novedad,
      referencias: referenciasNovedad,
      evidencias: evidenciasNovedad
    };
  }
};