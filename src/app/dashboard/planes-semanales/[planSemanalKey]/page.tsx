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

import { PageHeader } from "../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { StatusChip } from "../../../../components/common/StatusChip";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import {
  PlanSemanalTraceabilityData,
  planSemanalTraceabilityService
} from "../../../../services/planSemanalTraceability.service";

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

export default function PlanSemanalDetallePage() {
  const params = useParams();
  const router = useRouter();

  const planSemanalKey = params.planSemanalKey as string;

  const [data, setData] = useState<PlanSemanalTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planSemanal = data?.planSemanal ?? null;
  const reportesDiarios = data?.reportesDiarios ?? [];
  const novedades = data?.novedades ?? [];
  const informesSemanales = data?.informesSemanales ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const cantidadProgramada = planSemanal?.orsCantidunidadPlse ?? 0;
  const cantidadEjecutada = planSemanal?.orsEjecutunidadPlse ?? 0;

  const avanceCalculado = useMemo(() => {
    if (cantidadProgramada <= 0) return 0;

    return Math.round((cantidadEjecutada / cantidadProgramada) * 100);
  }, [cantidadProgramada, cantidadEjecutada]);

  const totalReportado = useMemo(
    () =>
      reportesDiarios.reduce(
        (total, row) => total + (row.orsEjecutunidadPdia ?? 0),
        0
      ),
    [reportesDiarios]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await planSemanalTraceabilityService.getByPlanSemanal(
        planSemanalKey
      );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del plan semanal."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!planSemanalKey) return;

    void loadData();
  }, [planSemanalKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle plan semanal"
        subtitle={`Consulta de trazabilidad para el plan semanal ${planSemanalKey}.`}
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
                label="Avance calculado"
                value={`${avanceCalculado}%`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Reportes diarios"
                value={reportesDiarios.length}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Novedades" value={novedades.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Evidencias" value={evidencias.length} />
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
                Información general del plan semanal
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código plan semanal"
                    value={planSemanal?.orsIdentifkeyPlse ?? planSemanalKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Orden" value={planSemanal?.orsIdentifkeyOrde} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan trabajo"
                    value={planSemanal?.orsIdentifkeyPltr}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proyección semanal"
                    value={planSemanal?.orsIdentifkeyPsem}
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

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor unidad"
                    value={formatCurrency(planSemanal?.orsValorunidadPlse)}
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

                    <StatusChip value={planSemanal?.orsEstadoregPlse} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor total"
                    value={formatCurrency(planSemanal?.orsValortotalPlse)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor ejecutado"
                    value={formatCurrency(planSemanal?.orsValorejecutPlse)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Total reportado"
                    value={formatNumber(totalReportado)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo registro"
                    value={planSemanal?.orsTiporegistPlse}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Observación"
                    value="Trazabilidad consolidada del plan semanal con reportes, novedades, informes y evidencias."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={reportesDiarios.length === 0}
            emptyTitle="Sin reportes diarios"
            emptyDescription="No hay reportes diarios asociados a este plan semanal."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporte</TableCell>
                  <TableCell>Orden</TableCell>
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
            isEmpty={novedades.length === 0}
            emptyTitle="Sin novedades"
            emptyDescription="No hay novedades asociadas a este plan semanal."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Novedad</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Registro base</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {novedades.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyNove ??
                      row.orsIdentifkeyNove ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyNove}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsFechreportNove}</TableCell>
                    <TableCell>{row.orsTiponovedadNovt}</TableCell>
                    <TableCell>
                      {row.orsRegistbaseNove ?? row.orsRegistrbaseNove}
                    </TableCell>
                    <TableCell>{row.orsRegistrnoveNove}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregNove} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={informesSemanales.length === 0}
            emptyTitle="Sin informes semanales"
            emptyDescription="No hay informes semanales asociados a este plan semanal."
            minWidth={1050}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Informe</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Inicio</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell>Programado</TableCell>
                  <TableCell>Ejecutado</TableCell>
                  <TableCell>Cumplimiento</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {informesSemanales.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyInse ??
                      row.orsIdentifkeyInse ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyInse}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsFechainicioInse}</TableCell>
                    <TableCell>{row.orsFechafinInse}</TableCell>
                    <TableCell>
                      {formatNumber(row.orsAvanceprogramadoInse)}
                    </TableCell>
                    <TableCell>
                      {formatNumber(row.orsAvanceejecutadoInse)}
                    </TableCell>
                    <TableCell>
                      {formatNumber(row.orsPorccumplimientoInse)}%
                    </TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregInse} />
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
            emptyDescription="No hay referencias de evidencias asociadas a este plan semanal."
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
            emptyDescription="No hay evidencias o fotos asociadas a este plan semanal."
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