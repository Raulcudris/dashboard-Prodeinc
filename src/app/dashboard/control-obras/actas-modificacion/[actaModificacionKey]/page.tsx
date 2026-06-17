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
  ActaModificacionTraceabilityData,
  actaModificacionTraceabilityService
} from "../../../../../services/actaModificacionTraceability.service";

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

export default function ActaModificacionDetallePage() {
  const params = useParams();
  const router = useRouter();

  const actaModificacionKey = params.actaModificacionKey as string;

  const [data, setData] =
    useState<ActaModificacionTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actaModificacion = data?.actaModificacion ?? null;
  const detalles = data?.detalles ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const totalValorActualDetalles = useMemo(
    () =>
      detalles.reduce(
        (total, row) => total + (row.orsValoractualAcdt ?? 0),
        0
      ),
    [detalles]
  );

  const totalValorModificadoDetalles = useMemo(
    () =>
      detalles.reduce(
        (total, row) => total + (row.orsValormodificadoAcdt ?? 0),
        0
      ),
    [detalles]
  );

  const totalValorFinalDetalles = useMemo(
    () =>
      detalles.reduce(
        (total, row) => total + (row.orsValortotalAcdt ?? 0),
        0
      ),
    [detalles]
  );

  const diferenciaActa =
    (actaModificacion?.orsValortotalAcmo ?? 0) -
    (actaModificacion?.orsValoractualAcmo ?? 0);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await actaModificacionTraceabilityService.getByActaModificacion(
          actaModificacionKey
        );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del acta de modificación."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!actaModificacionKey) return;

    void loadData();
  }, [actaModificacionKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle acta de modificación"
        subtitle={`Consulta de trazabilidad para el acta ${actaModificacionKey}.`}
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
              <MetricBox label="Detalles" value={detalles.length} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Valor actual"
                value={formatCurrency(actaModificacion?.orsValoractualAcmo)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Valor total acta"
                value={formatCurrency(actaModificacion?.orsValortotalAcmo)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricBox
                label="Diferencia"
                value={formatCurrency(diferenciaActa)}
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
                Información general del acta
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Código acta"
                    value={
                      actaModificacion?.orsIdentifkeyAcmo ??
                      actaModificacionKey
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Orden"
                    value={actaModificacion?.orsIdentifkeyOrde}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Número acta"
                    value={actaModificacion?.orsNumeroactaAcmo}
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

                    <StatusChip value={actaModificacion?.orsEstadoregAcmo} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha acta"
                    value={actaModificacion?.orsFechaactaAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo acta"
                    value={actaModificacion?.orsTipoactaAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor actual"
                    value={formatCurrency(actaModificacion?.orsValoractualAcmo)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor modificado"
                    value={formatCurrency(
                      actaModificacion?.orsValormodificadoAcmo
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Valor total"
                    value={formatCurrency(actaModificacion?.orsValortotalAcmo)}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Inicio actual"
                    value={actaModificacion?.orsFechainicioActualAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fin actual"
                    value={actaModificacion?.orsFechafinActualAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Inicio nuevo"
                    value={actaModificacion?.orsFechainicioNuevaAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fin nuevo"
                    value={actaModificacion?.orsFechafinNuevaAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Referencias evidencia"
                    value={referencias.length}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Evidencias" value={evidencias.length} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />

                  <InfoItem
                    label="Concepto"
                    value={actaModificacion?.orsConceptoAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem
                    label="Descripción"
                    value={actaModificacion?.orsDescripcionAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem
                    label="Justificación"
                    value={actaModificacion?.orsJustificacionAcmo}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <InfoItem
                    label="Observación"
                    value={actaModificacion?.orsObservacionAcmo}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox
                label="Valor actual detalles"
                value={formatCurrency(totalValorActualDetalles)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox
                label="Valor modificado detalles"
                value={formatCurrency(totalValorModificadoDetalles)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <MetricBox
                label="Valor total detalles"
                value={formatCurrency(totalValorFinalDetalles)}
              />
            </Grid>
          </Grid>

          <CrudTableCard
            loading={false}
            isEmpty={detalles.length === 0}
            emptyTitle="Sin detalles del acta"
            emptyDescription="No hay detalles asociados a esta acta de modificación."
            minWidth={1500}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan trabajo</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Sitio</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell>Cantidad actual</TableCell>
                  <TableCell>Cantidad modificada</TableCell>
                  <TableCell>Valor unidad</TableCell>
                  <TableCell>Valor actual</TableCell>
                  <TableCell>Valor modificado</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {detalles.map((row, index) => (
                  <TableRow
                    key={
                      row.orsPrimarykeyAcdt ??
                      row.orsIdentifkeyAcdt ??
                      index
                    }
                  >
                    <TableCell>{row.orsIdentifkeyAcdt}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                    <TableCell>{row.orsDescripcionAcdt}</TableCell>
                    <TableCell>{row.orsUnidadAcdt}</TableCell>
                    <TableCell>
                      {formatNumber(row.orsCantidadactualAcdt)}
                    </TableCell>
                    <TableCell>
                      {formatNumber(row.orsCantidadmodificadaAcdt)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.orsValorunidadAcdt)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.orsValoractualAcdt)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.orsValormodificadoAcdt)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(row.orsValortotalAcdt)}
                    </TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregAcdt} />
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
            emptyDescription="No hay referencias de evidencias asociadas a esta acta."
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
            emptyDescription="No hay evidencias o soportes asociados a esta acta."
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