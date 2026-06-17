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
  ordenTraceabilityService,
  OrdenTraceabilityData
} from "../../../../services/ordenTraceability.service";

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
        borderColor: "rgba(148, 163, 184, 0.2)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
      }}
    >
      <CardContent>
        <Box
          component="p"
          sx={{
            m: 0,
            mb: 0.5,
            color: "text.secondary",
            fontSize: "0.82rem",
            fontWeight: 700
          }}
        >
          {label}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            fontSize: "1.45rem",
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

export default function OrdenServicioDetallePage() {
  const params = useParams();
  const router = useRouter();

  const ordenKey = params.ordenKey as string;

  const [data, setData] = useState<OrdenTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orden = data?.orden ?? null;
  const sitios = data?.sitios ?? [];
  const proyecciones = data?.proyecciones ?? [];
  const planes = data?.planes ?? [];
  const planesSemanales = data?.planesSemanales ?? [];
  const reportesDiarios = data?.reportesDiarios ?? [];
  const novedades = data?.novedades ?? [];
  const resumenEquipos = data?.resumenEquipos ?? [];
  const actasModificacion = data?.actasModificacion ?? [];
  const avance = data?.avance ?? [];

  const totalPlaneado = useMemo(
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

  const porcentajeAvance =
    totalPlaneado > 0 ? Math.round((totalEjecutado / totalPlaneado) * 100) : 0;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordenTraceabilityService.getByOrden(ordenKey);
      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar la trazabilidad de la orden de servicio."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ordenKey) return;

    void loadData();
  }, [ordenKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle orden de servicio"
        subtitle={`Trazabilidad completa de la orden ${ordenKey}.`}
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
              <MetricBox label="Sitios" value={sitios.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Planes" value={planes.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Reportes diarios" value={reportesDiarios.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Avance" value={`${porcentajeAvance}%`} />
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
                Información general
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código orden"
                    value={orden?.orsIdentifkeyOrde ?? ordenKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código servicio"
                    value={orden?.orsCodservicioSebs}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha autorización"
                    value={orden?.orsAutorifechaOrde}
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

                    <StatusChip value={orden?.orsEstadoregOrde} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoItem
                    label="Evento / servicio"
                    value={orden?.orsServiceventOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoItem label="Lugar" value={orden?.orsServiclugarOrde} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem label="Objeto" value={orden?.orsServicobjetoOrde} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Inicio plan"
                    value={orden?.orsPlanfechiniOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fin plan"
                    value={orden?.orsPlanfechfinOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proveedor"
                    value={orden?.prvIdentifkeyMprv}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Representante legal"
                    value={orden?.prvIdentifkeyRelg}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="Valor base"
                    value={formatCurrency(orden?.orsValorbaseOrde)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="IVA"
                    value={formatCurrency(orden?.orsValordeivaOrde)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <InfoItem
                    label="Valor total"
                    value={formatCurrency(orden?.orsValortotalOrde)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={sitios.length === 0}
            emptyTitle="Sin sitios asociados"
            emptyDescription="No hay sitios o puntos asociados a esta orden."
            minWidth={850}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sitio</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell>Latitud</TableCell>
                  <TableCell>Longitud</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sitios.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyPunt ?? row.orsIdentifkeyPunt ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                    <TableCell>{row.orsNombresitioPunt}</TableCell>
                    <TableCell>{row.sisCodproSipr}</TableCell>
                    <TableCell>{row.orsGeolatitudePunt}</TableCell>
                    <TableCell>{row.orsGeolongitudePunt}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregPunt} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={proyecciones.length === 0}
            emptyTitle="Sin proyección semanal"
            emptyDescription="No hay semanas proyectadas asociadas a esta orden."
            minWidth={850}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Semana</TableCell>
                  <TableCell>Fecha inicio</TableCell>
                  <TableCell>Fecha fin</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {proyecciones.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyPsem ?? row.orsIdentifkeyPsem ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsNumsemanaPsem}</TableCell>
                    <TableCell>{row.orsFechainicioPsem}</TableCell>
                    <TableCell>{row.orsFechafinPsem}</TableCell>
                    <TableCell>{row.orsDescripcionPsem}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregPsem} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={planes.length === 0}
            emptyTitle="Sin planes de trabajo"
            emptyDescription="No hay planes de trabajo asociados a esta orden."
            minWidth={1050}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan</TableCell>
                  <TableCell>Sitio</TableCell>
                  <TableCell>Actividad</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planes.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyPltr ?? row.orsIdentifkeyPltr ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                    <TableCell>{row.orsDesactividadPltr}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{formatNumber(row.orsCantidunidadRseq)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValortotalRseq)}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregPltr} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={planesSemanales.length === 0}
            emptyTitle="Sin planes semanales"
            emptyDescription="No hay planes semanales asociados a esta orden."
            minWidth={1100}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Plan trabajo</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Cantidad programada</TableCell>
                  <TableCell>Cantidad ejecutada</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Valor ejecutado</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planesSemanales.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyPlse ?? row.orsIdentifkeyPlse ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{formatNumber(row.orsCantidunidadPlse)}</TableCell>
                    <TableCell>{formatNumber(row.orsEjecutunidadPlse)}</TableCell>
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
            emptyDescription="No hay reportes diarios asociados a esta orden."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporte</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cantidad ejecutada</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportesDiarios.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyPdia ?? row.orsIdentifkeyPdia ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyPdia}</TableCell>
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
            isEmpty={novedades.length === 0}
            emptyTitle="Sin novedades"
            emptyDescription="No hay novedades asociadas a esta orden."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Novedad</TableCell>
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
                    key={row.orsPrimarykeyNove ?? row.orsIdentifkeyNove ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyNove}</TableCell>
                    <TableCell>{row.orsFechreportNove}</TableCell>
                    <TableCell>{row.orsTiponovedadNovt}</TableCell>
                    <TableCell>{row.orsRegistrbaseNove}</TableCell>
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
            isEmpty={resumenEquipos.length === 0}
            emptyTitle="Sin resumen de equipos"
            emptyDescription="No hay resumen de equipos asociado a esta orden."
            minWidth={850}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Resumen</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor unidad</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumenEquipos.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyRseq ?? row.orsIdentifkeyRseq ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyRseq}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{formatNumber(row.orsCantidadRseq)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValorunidadRseq)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValortotalRseq)}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregRseq} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={actasModificacion.length === 0}
            emptyTitle="Sin actas de modificación"
            emptyDescription="No hay actas de modificación asociadas a esta orden."
            minWidth={1050}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Acta</TableCell>
                  <TableCell>Número</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Concepto</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {actasModificacion.map((row, index) => (
                  <TableRow
                    key={row.orsPrimarykeyAcmo ?? row.orsIdentifkeyAcmo ?? index}
                  >
                    <TableCell>{row.orsIdentifkeyAcmo}</TableCell>
                    <TableCell>{row.orsNumeroactaAcmo}</TableCell>
                    <TableCell>{row.orsFechaactaAcmo}</TableCell>
                    <TableCell>{row.orsTipoactaAcmo}</TableCell>
                    <TableCell>{row.orsConceptoAcmo}</TableCell>
                    <TableCell>{formatCurrency(row.orsValortotalAcmo)}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregAcmo} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>

          <Box sx={{ height: 24 }} />

          <CrudTableCard
            loading={false}
            isEmpty={avance.length === 0}
            emptyTitle="Sin avance consolidado"
            emptyDescription="No hay datos consolidados de avance para esta orden."
            minWidth={900}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(avance[0] ?? {})
                    .slice(0, 8)
                    .map(column => (
                      <TableCell key={column}>{column}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {avance.map((row, index) => (
                  <TableRow key={index}>
                    {Object.keys(avance[0] ?? {})
                      .slice(0, 8)
                      .map(column => (
                        <TableCell key={column}>
                          {String(row[column] ?? "-")}
                        </TableCell>
                      ))}
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