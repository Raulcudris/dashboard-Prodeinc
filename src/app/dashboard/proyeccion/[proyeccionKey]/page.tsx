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
import { useParams, useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { StatusChip } from "../../../../components/common/StatusChip";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import {
  ProyeccionTraceabilityData,
  proyeccionTraceabilityService
} from "../../../../services/proyeccionesTraceability.service";

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

export default function ProyeccionDetallePage() {
  const params = useParams();
  const router = useRouter();

  const proyeccionKey = params.proyeccionKey as string;

  const [data, setData] =
    useState<ProyeccionTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proyeccion = data?.proyeccion ?? null;
  const planesSemanales = data?.planesSemanales ?? [];
  const reportesDiarios = data?.reportesDiarios ?? [];
  const informesSemanales = data?.informesSemanales ?? [];

  const totalProgramado = useMemo(
    () =>
      planesSemanales.reduce(
        (total, row) => total + (row.orsCantidunidadPlse ?? 0),
        0
      ),
    [planesSemanales]
  );

  const totalEjecutado = useMemo(
    () =>
      planesSemanales.reduce(
        (total, row) => total + (row.orsEjecutunidadPlse ?? 0),
        0
      ),
    [planesSemanales]
  );

  const valorProgramado = useMemo(
    () =>
      planesSemanales.reduce(
        (total, row) => total + (row.orsValortotalPlse ?? 0),
        0
      ),
    [planesSemanales]
  );

  const valorEjecutado = useMemo(
    () =>
      planesSemanales.reduce(
        (total, row) => total + (row.orsValorejecutPlse ?? 0),
        0
      ),
    [planesSemanales]
  );

  const porcentajeAvance =
    totalProgramado > 0
      ? Math.round((totalEjecutado / totalProgramado) * 100)
      : 0;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await proyeccionTraceabilityService.getByProyeccion(
          proyeccionKey
        );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle de la proyección semanal."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!proyeccionKey) return;

    void loadData();
  }, [proyeccionKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle proyección"
        subtitle={`Consulta de trazabilidad para la proyección ${proyeccionKey}.`}
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
              <MetricBox label="Planes semanales" value={planesSemanales.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Reportes diarios" value={reportesDiarios.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Informes semanales" value={informesSemanales.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Avance ejecutado" value={`${porcentajeAvance}%`} />
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
                Información general de la proyección
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código proyección"
                    value={proyeccion?.orsIdentifkeyPsem ?? proyeccionKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Orden" value={proyeccion?.orsIdentifkeyOrde} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Semana"
                    value={proyeccion?.orsNumsemanaPsem ?? 0}
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

                    <StatusChip value={proyeccion?.orsEstadoregPsem} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha inicio"
                    value={proyeccion?.orsFechainicioPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha fin"
                    value={proyeccion?.orsFechafinPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo registro"
                    value={proyeccion?.orsTiporegistPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Avance calculado"
                    value={`${porcentajeAvance}%`}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Descripción"
                    value={proyeccion?.orsDescripcionPsem}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Cantidad programada"
                value={formatNumber(totalProgramado)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <MetricBox
                label="Cantidad ejecutada"
                value={formatNumber(totalEjecutado)}
              />
            </Grid>

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
          </Grid>

          <CrudTableCard
            loading={false}
            isEmpty={planesSemanales.length === 0}
            emptyTitle="Sin planes semanales"
            emptyDescription="No hay planes semanales asociados a esta proyección."
            minWidth={1100}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan trabajo</TableCell>
                  <TableCell>Cantidad programada</TableCell>
                  <TableCell>Cantidad ejecutada</TableCell>
                  <TableCell>Valor unidad</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Valor ejecutado</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {planesSemanales.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyPlse ??
                      row.orsIdentifkeyPlse ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{formatNumber(row.orsCantidunidadPlse)}</TableCell>
                    <TableCell>{formatNumber(row.orsEjecutunidadPlse)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValorunidadPlse)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValortotalPlse)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValorejecutPlse)}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregPlse} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={reportesDiarios.length === 0}
            emptyTitle="Sin reportes diarios"
            emptyDescription="No hay reportes diarios asociados a esta proyección."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporte</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan semanal</TableCell>
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
            isEmpty={informesSemanales.length === 0}
            emptyTitle="Sin informes semanales"
            emptyDescription="No hay informes semanales asociados a esta proyección."
            minWidth={1050}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Informe</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Fecha inicio</TableCell>
                  <TableCell>Fecha fin</TableCell>
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
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsFechainicioInse}</TableCell>
                    <TableCell>{row.orsFechafinInse}</TableCell>
                    <TableCell>{formatNumber(row.orsAvanceprogramadoInse)}</TableCell>
                    <TableCell>{formatNumber(row.orsAvanceejecutadoInse)}</TableCell>
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
        </>
      )}
    </Box>
  );
}