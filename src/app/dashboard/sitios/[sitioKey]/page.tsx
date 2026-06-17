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
  SitioTraceabilityData,
  sitioTraceabilityService
} from "../../../../services/sitioTraceability.service";

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

export default function SitioDetallePage() {
  const params = useParams();
  const router = useRouter();

  const sitioKey = params.sitioKey as string;

  const [data, setData] = useState<SitioTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sitio = data?.sitio ?? null;
  const planesTrabajo = data?.planesTrabajo ?? [];
  const planesSemanales = data?.planesSemanales ?? [];
  const reportesDiarios = data?.reportesDiarios ?? [];
  const novedades = data?.novedades ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const cantidadProgramada = useMemo(
    () =>
      planesSemanales.reduce(
        (total, row) => total + (row.orsCantidunidadPlse ?? 0),
        0
      ),
    [planesSemanales]
  );

  const cantidadEjecutada = useMemo(
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

  const avanceCalculado =
    cantidadProgramada > 0
      ? Math.round((cantidadEjecutada / cantidadProgramada) * 100)
      : 0;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await sitioTraceabilityService.getBySitio(sitioKey);
      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del sitio o punto de trabajo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sitioKey) return;

    void loadData();
  }, [sitioKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle sitio / punto"
        subtitle={`Consulta de trazabilidad para el sitio ${sitioKey}.`}
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
              <MetricBox label="Planes de trabajo" value={planesTrabajo.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Planes semanales" value={planesSemanales.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Reportes diarios" value={reportesDiarios.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox label="Avance calculado" value={`${avanceCalculado}%`} />
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
                Información general del sitio
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código sitio"
                    value={sitio?.orsIdentifkeyPunt ?? sitioKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Orden" value={sitio?.orsIdentifkeyOrde} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Proyecto" value={sitio?.sisCodproSipr} />
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

                    <StatusChip value={sitio?.orsEstadoregPunt} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoItem
                    label="Nombre sitio / punto"
                    value={sitio?.orsNombresitioPunt}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Latitud" value={sitio?.orsGeolatitudePunt} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Longitud" value={sitio?.orsGeolongitudePunt} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Cantidad programada"
                    value={formatNumber(cantidadProgramada)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Cantidad ejecutada"
                    value={formatNumber(cantidadEjecutada)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor programado"
                    value={formatCurrency(valorProgramado)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor ejecutado"
                    value={formatCurrency(valorEjecutado)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Imagen / ruta"
                    value={sitio?.orsPathimagenPunt}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <CrudTableCard
            loading={false}
            isEmpty={planesTrabajo.length === 0}
            emptyTitle="Sin planes de trabajo"
            emptyDescription="No hay planes de trabajo asociados a este sitio."
            minWidth={1050}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Actividad</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor unidad</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {planesTrabajo.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyPltr ??
                      row.orsIdentifkeyPltr ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsDesactividadPltr}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{formatNumber(row.orsCantidunidadRseq)}</TableCell>
                    <TableCell>{formatCurrency(row.orsValorunidadRseq)}</TableCell>
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
            emptyDescription="No hay planes semanales asociados a este sitio."
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
                    key={
                      row.orsPrimarykeyPlse ??
                      row.orsIdentifkeyPlse ??
                      index
                    }
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
            emptyDescription="No hay reportes diarios asociados a este sitio."
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
            isEmpty={novedades.length === 0}
            emptyTitle="Sin novedades"
            emptyDescription="No hay novedades asociadas a este sitio."
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
            isEmpty={referencias.length === 0}
            emptyTitle="Sin referencias de evidencia"
            emptyDescription="No hay referencias de evidencias asociadas a este sitio."
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
            emptyDescription="No hay evidencias o fotos asociadas a este sitio."
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