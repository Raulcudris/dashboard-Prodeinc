import { evidenciasService } from "./evidencias.service";
import {
  EvidenciaDto,
  ReferenciaEvidenciaDto,
  TipoEvidenciaDto
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

export interface EvidenciaTraceabilityData {
  evidencia: EvidenciaDto | null;
  tipoEvidencia: TipoEvidenciaDto | null;
  referencias: ReferenciaEvidenciaDto[];
}

export const evidenciaTraceabilityService = {
  async getByEvidencia(
    evidenciaKey: string
  ): Promise<EvidenciaTraceabilityData> {
    const [evidencias, tipos, referencias] = await Promise.all([
      getPageData(() =>
        evidenciasService.evidencias.getPages({
          currentPage: 1,
          pageSize: 500,
          parameter: "TEXT",
          filter: ""
        })
      ),

      getPageData(() =>
        evidenciasService.tipos.getPages({
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
      )
    ]);

    const evidencia =
      evidencias.find(row => sameKey(row.eviIdentifkeyEvid, evidenciaKey)) ??
      null;

    const tipoEvidencia =
      tipos.find(row =>
        sameKey(row.eviIdentifkeyTiev, evidencia?.eviIdentifkeyTiev)
      ) ?? null;

    const referenciasEvidencia = referencias.filter(row =>
      sameKey(row.eviIdentifkeyEvid, evidenciaKey)
    );

    return {
      evidencia,
      tipoEvidencia,
      referencias: referenciasEvidencia
    };
  }
};