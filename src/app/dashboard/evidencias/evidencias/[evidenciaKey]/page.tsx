"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useParams, useRouter } from "next/navigation";

import { PageHeader } from "../../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../../components/common/LoadingBox";
import { StatusChip } from "../../../../../components/common/StatusChip";
import { CrudTableCard } from "../../../../../components/common/CrudTableCard";
import {
  evidenciaTraceabilityService,
  EvidenciaTraceabilityData
} from "../../../../../services/evidenciaTraceability.service";
import { ReferenciaEvidenciaDto } from "../../../../../types/evidencias.types";

function blurActiveElement() {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function InfoItem({
  label,
  value
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <Box>
      <Box
        component="p"
        sx={{
          m: 0,
          mb: 0.5,
          fontSize: "0.76rem",
          fontWeight: 800,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.04em"
        }}
      >
        {label}
      </Box>

      <Box
        component="p"
        sx={{
          m: 0,
          fontSize: "0.95rem",
          fontWeight: 650,
          color: "text.primary",
          wordBreak: "break-word"
        }}
      >
        {value ?? "-"}
      </Box>
    </Box>
  );
}

function MetricBox({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
      }}
    >
      <CardContent>
        <Box
          component="p"
          sx={{
            m: 0,
            color: "text.secondary",
            fontSize: "0.84rem",
            fontWeight: 700
          }}
        >
          {label}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 0.5,
            fontSize: "1.55rem",
            fontWeight: 900,
            color: "#0b5137"
          }}
        >
          {value}
        </Box>
      </CardContent>
    </Card>
  );
}

function isImageUrl(url?: string) {
  const cleanUrl = String(url ?? "").toLowerCase().split("?")[0];

  return (
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif")
  );
}

function buildReferenceRowKey(row: ReferenciaEvidenciaDto, index: number) {
  return (
    row.eviPrimarykeyRefe ??
    row.eviIdentifkeyRefe ??
    `${row.eviIdentifkeyEvid ?? "REFE"}-${index}`
  );
}

export default function EvidenciaDetallePage() {
  const params = useParams();
  const router = useRouter();

  const evidenciaKey = String(params.evidenciaKey ?? "");

  const [data, setData] = useState<EvidenciaTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evidencia = data?.evidencia ?? null;
  const tipoEvidencia = data?.tipoEvidencia ?? null;
  const referencias = data?.referencias ?? [];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await evidenciaTraceabilityService.getByEvidencia(
        evidenciaKey
      );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle de la evidencia."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!evidenciaKey) return;

    void loadData();
  }, [evidenciaKey]);

  const handleBack = () => {
    blurActiveElement();
    router.back();
  };

  const handleOpenFile = () => {
    blurActiveElement();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle de evidencia"
        subtitle={`Consulta de trazabilidad para la evidencia ${evidenciaKey}.`}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onMouseDown={event => event.preventDefault()}
            onClick={handleBack}
          >
            Volver
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox label="Referencias" value={referencias.length} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox
                label="Tipo evidencia"
                value={
                  tipoEvidencia?.eviDescripcionTiev ??
                  evidencia?.eviIdentifkeyTiev ??
                  "-"
                }
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox
                label="Estado"
                value={String(evidencia?.eviEstadoregEvid ?? "-")}
              />
            </Grid>
          </Grid>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  mb: 2,
                  fontSize: "1.25rem",
                  fontWeight: 900
                }}
              >
                Información general de la evidencia
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código evidencia"
                    value={evidencia?.eviIdentifkeyEvid ?? evidenciaKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo"
                    value={evidencia?.eviIdentifkeyTiev}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Descripción tipo"
                    value={tipoEvidencia?.eviDescripcionTiev}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Box>
                    <Box
                      component="p"
                      sx={{
                        m: 0,
                        mb: 0.5,
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        color: "text.secondary",
                        textTransform: "uppercase"
                      }}
                    >
                      Estado
                    </Box>

                    <StatusChip value={evidencia?.eviEstadoregEvid} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="Archivo"
                    value={evidencia?.eviNombrearchivoEvid}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="Fecha captura"
                    value={evidencia?.eviFechacapturaEvid}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <InfoItem
                    label="Latitud"
                    value={evidencia?.eviLatitudEvid}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <InfoItem
                    label="Longitud"
                    value={evidencia?.eviLongitudEvid}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Descripción"
                    value={evidencia?.eviDescripcionEvid}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem
                    label="URL archivo"
                    value={evidencia?.eviUrlarchivoEvid}
                  />
                </Grid>

                {evidencia?.eviUrlarchivoEvid && (
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="outlined"
                      startIcon={<OpenInNewIcon />}
                      href={evidencia.eviUrlarchivoEvid}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseDown={event => event.preventDefault()}
                      onClick={handleOpenFile}
                    >
                      Abrir archivo
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {evidencia?.eviUrlarchivoEvid &&
            isImageUrl(evidencia.eviUrlarchivoEvid) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    component="h2"
                    sx={{
                      m: 0,
                      mb: 2,
                      fontSize: "1.25rem",
                      fontWeight: 900
                    }}
                  >
                    Vista previa
                  </Box>

                  <Box
                    component="img"
                    src={evidencia.eviUrlarchivoEvid}
                    alt={
                      evidencia.eviNombrearchivoEvid ??
                      evidencia.eviIdentifkeyEvid ??
                      "Evidencia"
                    }
                    sx={{
                      width: "100%",
                      maxHeight: 520,
                      objectFit: "contain",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "rgba(148, 163, 184, 0.25)",
                      bgcolor: "#f8fafc"
                    }}
                  />
                </CardContent>
              </Card>
            )}

          <CrudTableCard
            loading={false}
            isEmpty={referencias.length === 0}
            emptyTitle="Sin referencias"
            emptyDescription="Esta evidencia no tiene registros asociados en referencias."
            minWidth={900}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Tipo registro</TableCell>
                  <TableCell>Registro relacionado</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Tipo registro interno</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {referencias.map((row, index) => (
                  <TableRow key={buildReferenceRowKey(row, index)}>
                    <TableCell>{row.eviIdentifkeyRefe}</TableCell>
                    <TableCell>{row.eviTiporegistroRefe}</TableCell>
                    <TableCell>{row.eviIdentifregistroRefe}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          maxWidth: 360,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle"
                        }}
                      >
                        {row.eviObservacionRefe}
                      </Box>
                    </TableCell>
                    <TableCell>{row.eviTiporegistRefe}</TableCell>
                    <TableCell>
                      <StatusChip value={row.eviEstadoregRefe} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>
        </>
      )}
    </Box>
  );
}