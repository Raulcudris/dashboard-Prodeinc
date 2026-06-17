"use client";

import { useEffect, useMemo, useState } from "react";
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
  DetalleEquipoOperacionTraceabilityData,
  detalleEquipoOperacionTraceabilityService
} from "../../../../../services/detalleEquipoOperacionTraceability.service";

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

function calculateDifference(finalValue?: number, initialValue?: number) {
  const diff = (finalValue ?? 0) - (initialValue ?? 0);
  return diff > 0 ? diff : 0;
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
          color: "text.primary"
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

export default function DetalleEquipoOperacionDetallePage() {
  const params = useParams();
  const router = useRouter();

  const detalleEquipoOperacionKey =
    params.detalleEquipoOperacionKey as string;

  const [data, setData] =
    useState<DetalleEquipoOperacionTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detalleEquipo = data?.detalleEquipo ?? null;
  const reporteOperacion = data?.reporteOperacion ?? null;
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const totalHorometro = useMemo(
    () =>
      calculateDifference(
        detalleEquipo?.orsHorometrofinDeop,
        detalleEquipo?.orsHorometroiniDeop
      ),
    [detalleEquipo]
  );

  const totalKilometraje = useMemo(
    () =>
      calculateDifference(
        detalleEquipo?.orsKmfinalDeop,
        detalleEquipo?.orsKminicialDeop
      ),
    [detalleEquipo]
  );

  const valorEstimado = useMemo(() => {
    const dias = detalleEquipo?.orsDiatrabajadoDeop ?? 0;
    const valorUnidad = detalleEquipo?.orsValorunidadDeop ?? 0;

    return dias * valorUnidad;
  }, [detalleEquipo]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await detalleEquipoOperacionTraceabilityService.getByDetalleEquipoOperacion(
          detalleEquipoOperacionKey
        );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del equipo en operación."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!detalleEquipoOperacionKey) return;

    void loadData();
  }, [detalleEquipoOperacionKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle equipo en operación"
        subtitle={`Consulta de trazabilidad para el detalle ${detalleEquipoOperacionKey}.`}
        action={
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Días trabajados"
                value={formatNumber(detalleEquipo?.orsDiatrabajadoDeop)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Horas horómetro"
                value={formatNumber(totalHorometro)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Kilometraje"
                value={formatNumber(totalKilometraje)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Valor estimado"
                value={formatCurrency(valorEstimado)}
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
                Información general del detalle
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código detalle"
                    value={
                      detalleEquipo?.orsIdentifkeyDeop ??
                      detalleEquipoOperacionKey
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Reporte operación"
                    value={detalleEquipo?.orsIdentifkeyRope}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Orden"
                    value={detalleEquipo?.orsIdentifkeyOrde}
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

                    <StatusChip value={detalleEquipo?.orsEstadoregDeop} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proyección semanal"
                    value={detalleEquipo?.orsIdentifkeyPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan semanal"
                    value={detalleEquipo?.orsIdentifkeyPlse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Sitio / punto"
                    value={detalleEquipo?.orsIdentifkeyPunt}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha trabajo"
                    value={detalleEquipo?.orsFechatrabajoDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código equipo"
                    value={detalleEquipo?.prvIdentifkeyInve}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo equipo"
                    value={detalleEquipo?.prvTipoequipoTieq}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Nombre equipo"
                    value={detalleEquipo?.orsNombrequipoDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Modelo / referencia"
                    value={detalleEquipo?.orsRefermodeloDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Número registro"
                    value={detalleEquipo?.orsNroregistroDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Unidad"
                    value={detalleEquipo?.orsUnidadDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo control"
                    value={detalleEquipo?.orsTipocontrolDeop}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor unidad"
                    value={formatCurrency(detalleEquipo?.orsValorunidadDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Observación"
                    value={detalleEquipo?.orsObservacionDeop}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                Lecturas operativas
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Horómetro inicial"
                    value={formatNumber(detalleEquipo?.orsHorometroiniDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Horómetro final"
                    value={formatNumber(detalleEquipo?.orsHorometrofinDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Total horas"
                    value={formatNumber(totalHorometro)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Día trabajado"
                    value={formatNumber(detalleEquipo?.orsDiatrabajadoDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="KM inicial"
                    value={formatNumber(detalleEquipo?.orsKminicialDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="KM final"
                    value={formatNumber(detalleEquipo?.orsKmfinalDeop)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Total KM"
                    value={formatNumber(totalKilometraje)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor estimado"
                    value={formatCurrency(valorEstimado)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
                Reporte de operación padre
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código reporte"
                    value={
                      reporteOperacion?.orsIdentifkeyRope ??
                      detalleEquipo?.orsIdentifkeyRope
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Orden"
                    value={reporteOperacion?.orsIdentifkeyOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha reporte"
                    value={reporteOperacion?.orsFechareportRope}
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
                      Estado reporte
                    </Box>

                    <StatusChip value={reporteOperacion?.orsEstadoregRope} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Observación reporte"
                    value={reporteOperacion?.orsObservacionRope}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={referencias.length === 0}
            emptyTitle="Sin referencias de evidencia"
            emptyDescription="No hay referencias de evidencias asociadas a este detalle de equipo."
            minWidth={900}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Evidencia</TableCell>
                  <TableCell>Tipo registro</TableCell>
                  <TableCell>Registro relacionado</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {referencias.map((row, index) => (
                  <TableRow
                    key={
                      row.eviPrimarykeyRefe ??
                      row.eviIdentifkeyRefe ??
                      index
                    }
                  >
                    <TableCell>{row.eviIdentifkeyRefe}</TableCell>
                    <TableCell>{row.eviIdentifkeyEvid}</TableCell>
                    <TableCell>{row.eviTiporegistroRefe}</TableCell>
                    <TableCell>{row.eviIdentifregistroRefe}</TableCell>
                    <TableCell>{row.eviObservacionRefe}</TableCell>
                    <TableCell>
                      <StatusChip value={row.eviEstadoregRefe} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={evidencias.length === 0}
            emptyTitle="Sin evidencias asociadas"
            emptyDescription="No hay evidencias o fotos asociadas a este detalle de equipo."
            minWidth={1000}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Evidencia</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Archivo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha captura</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Acción</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {evidencias.map((row, index) => (
                  <TableRow
                    key={
                      row.eviPrimarykeyEvid ??
                      row.eviIdentifkeyEvid ??
                      index
                    }
                  >
                    <TableCell>{row.eviIdentifkeyEvid}</TableCell>
                    <TableCell>{row.eviIdentifkeyTiev}</TableCell>
                    <TableCell>{row.eviNombrearchivoEvid}</TableCell>
                    <TableCell>{row.eviDescripcionEvid}</TableCell>
                    <TableCell>{row.eviFechacapturaEvid}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle"
                        }}
                      >
                        {row.eviUrlarchivoEvid}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {row.eviUrlarchivoEvid ? (
                        <Button
                          size="small"
                          startIcon={<OpenInNewIcon />}
                          href={row.eviUrlarchivoEvid}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusChip value={row.eviEstadoregEvid} />
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