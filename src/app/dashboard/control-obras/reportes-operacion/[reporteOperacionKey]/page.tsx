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
  ReporteOperacionTraceabilityData,
  reporteOperacionTraceabilityService
} from "../../../../../services/reporteOperacionTraceability.service";

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
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

export default function ReporteOperacionDetallePage() {
  const params = useParams();
  const router = useRouter();

  const reporteOperacionKey = params.reporteOperacionKey as string;

  const [data, setData] =
    useState<ReporteOperacionTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reporteOperacion = data?.reporteOperacion ?? null;
  const detallesEquipos = data?.detallesEquipos ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const totalDiasTrabajados = useMemo(
    () =>
      detallesEquipos.reduce(
        (total, row) => total + (row.orsDiatrabajadoDeop ?? 0),
        0
      ),
    [detallesEquipos]
  );

  const totalValorEstimado = useMemo(
    () =>
      detallesEquipos.reduce((total, row) => {
        const dias = row.orsDiatrabajadoDeop ?? 0;
        const valorUnidad = row.orsValorunidadDeop ?? 0;

        return total + dias * valorUnidad;
      }, 0),
    [detallesEquipos]
  );

  const totalHorometro = useMemo(
    () =>
      detallesEquipos.reduce((total, row) => {
        const inicial = row.orsHorometroiniDeop ?? 0;
        const final = row.orsHorometrofinDeop ?? 0;
        const diferencia = final - inicial;

        return total + (diferencia > 0 ? diferencia : 0);
      }, 0),
    [detallesEquipos]
  );

  const totalKilometraje = useMemo(
    () =>
      detallesEquipos.reduce((total, row) => {
        const inicial = row.orsKminicialDeop ?? 0;
        const final = row.orsKmfinalDeop ?? 0;
        const diferencia = final - inicial;

        return total + (diferencia > 0 ? diferencia : 0);
      }, 0),
    [detallesEquipos]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await reporteOperacionTraceabilityService.getByReporteOperacion(
          reporteOperacionKey
        );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del reporte de operación."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reporteOperacionKey) return;

    void loadData();
  }, [reporteOperacionKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle reporte de operación"
        subtitle={`Consulta de trazabilidad para el reporte ${reporteOperacionKey}.`}
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
                label="Equipos operados"
                value={detallesEquipos.length}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Días trabajados"
                value={formatNumber(totalDiasTrabajados)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Evidencias"
                value={evidencias.length}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Valor estimado"
                value={formatCurrency(totalValorEstimado)}
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
                Información general del reporte
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código reporte"
                    value={
                      reporteOperacion?.orsIdentifkeyRope ??
                      reporteOperacionKey
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
                      Estado
                    </Box>

                    <StatusChip value={reporteOperacion?.orsEstadoregRope} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Total horómetro"
                    value={formatNumber(totalHorometro)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Total kilometraje"
                    value={formatNumber(totalKilometraje)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo registro"
                    value={reporteOperacion?.orsTiporegistRope}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Referencias evidencia"
                    value={referencias.length}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Observación"
                    value={reporteOperacion?.orsObservacionRope}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={detallesEquipos.length === 0}
            emptyTitle="Sin detalles de equipos"
            emptyDescription="No hay equipos asociados a este reporte de operación."
            minWidth={1500}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Sitio</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Tipo equipo</TableCell>
                  <TableCell>Nombre equipo</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Registro</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell>Control</TableCell>
                  <TableCell>Fecha trabajo</TableCell>
                  <TableCell>Días</TableCell>
                  <TableCell>Valor unidad</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detallesEquipos.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyDeop ??
                      row.orsIdentifkeyDeop ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyDeop}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{row.prvTipoequipoTieq}</TableCell>
                    <TableCell>{row.orsNombrequipoDeop}</TableCell>
                    <TableCell>{row.orsRefermodeloDeop}</TableCell>
                    <TableCell>{row.orsNroregistroDeop}</TableCell>
                    <TableCell>{row.orsUnidadDeop}</TableCell>
                    <TableCell>{row.orsTipocontrolDeop}</TableCell>
                    <TableCell>{row.orsFechatrabajoDeop}</TableCell>
                    <TableCell>{formatNumber(row.orsDiatrabajadoDeop)}</TableCell>
                    <TableCell>
                      {formatCurrency(row.orsValorunidadDeop)}
                    </TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregDeop} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={detallesEquipos.length === 0}
            emptyTitle="Sin lecturas operativas"
            emptyDescription="No hay horómetros o kilometrajes asociados a este reporte."
            minWidth={1200}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Horómetro inicial</TableCell>
                  <TableCell>Horómetro final</TableCell>
                  <TableCell>Total horas</TableCell>
                  <TableCell>KM inicial</TableCell>
                  <TableCell>KM final</TableCell>
                  <TableCell>Total KM</TableCell>
                  <TableCell>Observación</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detallesEquipos.map((row, index) => {
                  const horas =
                    (row.orsHorometrofinDeop ?? 0) -
                    (row.orsHorometroiniDeop ?? 0);

                  const kilometros =
                    (row.orsKmfinalDeop ?? 0) -
                    (row.orsKminicialDeop ?? 0);

                  return (
                    <TableRow
                      key={
                        row.orsPrimarykeyDeop ??
                        row.orsIdentifkeyDeop ??
                        index
                      }
                    >
                      <TableCell>{row.orsIdentifkeyDeop}</TableCell>
                      <TableCell>{row.orsNombrequipoDeop}</TableCell>
                      <TableCell>
                        {formatNumber(row.orsHorometroiniDeop)}
                      </TableCell>
                      <TableCell>
                        {formatNumber(row.orsHorometrofinDeop)}
                      </TableCell>
                      <TableCell>{formatNumber(horas > 0 ? horas : 0)}</TableCell>
                      <TableCell>{formatNumber(row.orsKminicialDeop)}</TableCell>
                      <TableCell>{formatNumber(row.orsKmfinalDeop)}</TableCell>
                      <TableCell>
                        {formatNumber(kilometros > 0 ? kilometros : 0)}
                      </TableCell>
                      <TableCell>{row.orsObservacionDeop}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={referencias.length === 0}
            emptyTitle="Sin referencias de evidencia"
            emptyDescription="No hay referencias de evidencias asociadas a este reporte de operación."
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
            emptyDescription="No hay evidencias o fotos asociadas a este reporte de operación."
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