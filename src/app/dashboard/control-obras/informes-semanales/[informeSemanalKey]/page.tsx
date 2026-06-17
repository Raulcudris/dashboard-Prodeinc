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
  InformeSemanalTraceabilityData,
  informeSemanalTraceabilityService
} from "../../../../../services/informeSemanalTraceability.service";

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

export default function InformeSemanalDetallePage() {
  const params = useParams();
  const router = useRouter();

  const informeSemanalKey = params.informeSemanalKey as string;

  const [data, setData] =
    useState<InformeSemanalTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const informeSemanal = data?.informeSemanal ?? null;
  const proyeccionSemanal = data?.proyeccionSemanal ?? null;
  const planSemanal = data?.planSemanal ?? null;
  const reportesDiarios = data?.reportesDiarios ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const totalReportado = useMemo(
    () =>
      reportesDiarios.reduce(
        (total, row) => total + (row.orsEjecutunidadPdia ?? 0),
        0
      ),
    [reportesDiarios]
  );

  const avanceProgramado =
    informeSemanal?.orsAvanceprogramadoInse ??
    planSemanal?.orsCantidunidadPlse ??
    0;

  const avanceEjecutado =
    informeSemanal?.orsAvanceejecutadoInse ??
    planSemanal?.orsEjecutunidadPlse ??
    totalReportado;

  const cumplimientoCalculado =
    avanceProgramado > 0
      ? Math.round((avanceEjecutado / avanceProgramado) * 100)
      : 0;

  const valorProgramado = planSemanal?.orsValortotalPlse ?? 0;
  const valorEjecutado = planSemanal?.orsValorejecutPlse ?? 0;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await informeSemanalTraceabilityService.getByInformeSemanal(
          informeSemanalKey
        );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del informe semanal."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!informeSemanalKey) return;

    void loadData();
  }, [informeSemanalKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle informe semanal"
        subtitle={`Consulta de trazabilidad para el informe ${informeSemanalKey}.`}
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
                label="Avance programado"
                value={formatNumber(avanceProgramado)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Avance ejecutado"
                value={formatNumber(avanceEjecutado)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Cumplimiento"
                value={`${informeSemanal?.orsPorccumplimientoInse ?? cumplimientoCalculado}%`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Reportes diarios" value={reportesDiarios.length} />
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
                Información general del informe
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código informe"
                    value={
                      informeSemanal?.orsIdentifkeyInse ?? informeSemanalKey
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Orden"
                    value={informeSemanal?.orsIdentifkeyOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proyección semanal"
                    value={informeSemanal?.orsIdentifkeyPsem}
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

                    <StatusChip value={informeSemanal?.orsEstadoregInse} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan semanal"
                    value={informeSemanal?.orsIdentifkeyPlse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha inicio"
                    value={informeSemanal?.orsFechainicioInse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha fin"
                    value={informeSemanal?.orsFechafinInse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo registro"
                    value={informeSemanal?.orsTiporegistInse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Avance programado"
                    value={formatNumber(informeSemanal?.orsAvanceprogramadoInse)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Avance ejecutado"
                    value={formatNumber(informeSemanal?.orsAvanceejecutadoInse)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="% cumplimiento"
                    value={`${informeSemanal?.orsPorccumplimientoInse ?? cumplimientoCalculado}%`}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Evidencias" value={evidencias.length} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Descripción"
                    value={informeSemanal?.orsDescripcionInse}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem
                    label="Observación"
                    value={informeSemanal?.orsObservacionInse}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Valor programado"
                value={formatCurrency(valorProgramado)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Valor ejecutado"
                value={formatCurrency(valorEjecutado)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Referencias"
                value={referencias.length}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Evidencias"
                value={evidencias.length}
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
                Proyección y plan semanal relacionado
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proyección"
                    value={
                      proyeccionSemanal?.orsIdentifkeyPsem ??
                      informeSemanal?.orsIdentifkeyPsem
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Semana"
                    value={proyeccionSemanal?.orsNumsemanaPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Inicio proyección"
                    value={proyeccionSemanal?.orsFechainicioPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fin proyección"
                    value={proyeccionSemanal?.orsFechafinPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan semanal"
                    value={
                      planSemanal?.orsIdentifkeyPlse ??
                      informeSemanal?.orsIdentifkeyPlse
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan trabajo"
                    value={planSemanal?.orsIdentifkeyPltr}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Cantidad programada"
                    value={formatNumber(planSemanal?.orsCantidunidadPlse)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Cantidad ejecutada"
                    value={formatNumber(planSemanal?.orsEjecutunidadPlse)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Descripción proyección"
                    value={proyeccionSemanal?.orsDescripcionPsem}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={reportesDiarios.length === 0}
            emptyTitle="Sin reportes diarios"
            emptyDescription="No hay reportes diarios relacionados con este informe semanal."
            minWidth={1000}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporte</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Fecha reporte</TableCell>
                  <TableCell>Cantidad ejecutada</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reportesDiarios.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyPdia ??
                      row.orsIdentifkeyPdia ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyPdia}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsFechareportPdia}</TableCell>
                    <TableCell>{formatNumber(row.orsEjecutunidadPdia)}</TableCell>
                    <TableCell>{row.orsObservacionPdia}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregPdia} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={referencias.length === 0}
            emptyTitle="Sin referencias de evidencia"
            emptyDescription="No hay referencias de evidencias asociadas a este informe semanal."
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
            emptyDescription="No hay evidencias o soportes asociados a este informe semanal."
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