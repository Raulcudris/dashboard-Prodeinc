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
import { useParams, useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { StatusChip } from "../../../../components/common/StatusChip";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import {
  reporteDiarioTraceabilityService,
  ReporteDiarioTraceabilityData
} from "../../../../services/reporteDiarioTraceability.service";

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

export default function ReporteDiarioDetallePage() {
  const params = useParams();
  const router = useRouter();

  const reporteDiarioKey = params.reporteDiarioKey as string;

  const [data, setData] = useState<ReporteDiarioTraceabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reporte = data?.reporte ?? null;
  const novedades = data?.novedades ?? [];
  const referencias = data?.referencias ?? [];
  const evidencias = data?.evidencias ?? [];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reporteDiarioTraceabilityService.getByReporte(
        reporteDiarioKey
      );

      setData(response);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el detalle del reporte diario."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reporteDiarioKey) return;

    void loadData();
  }, [reporteDiarioKey]);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalle reporte diario"
        subtitle={`Consulta del reporte diario ${reporteDiarioKey}.`}
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
                    value={reporte?.orsIdentifkeyPdia ?? reporteDiarioKey}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem label="Orden" value={reporte?.orsIdentifkeyOrde} />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Plan semanal"
                    value={reporte?.orsIdentifkeyPlse}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Proyección semanal"
                    value={reporte?.orsIdentifkeyPsem}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Fecha reporte"
                    value={reporte?.orsFechareportPdia}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Cantidad ejecutada"
                    value={reporte?.orsEjecutunidadPdia ?? 0}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <InfoItem
                    label="Tipo registro"
                    value={reporte?.orsTiporegistPdia}
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

                    <StatusChip value={reporte?.orsEstadoregPdia} />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                  <InfoItem
                    label="Observación"
                    value={reporte?.orsObservacionPdia}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "rgba(148, 163, 184, 0.18)"
                }}
              >
                <CardContent>
                  <Box component="p" sx={{ m: 0, color: "text.secondary" }}>
                    Novedades asociadas
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      mt: 0.5,
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: "#0b5137"
                    }}
                  >
                    {novedades.length}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "rgba(148, 163, 184, 0.18)"
                }}
              >
                <CardContent>
                  <Box component="p" sx={{ m: 0, color: "text.secondary" }}>
                    Referencias de evidencia
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      mt: 0.5,
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: "#0b5137"
                    }}
                  >
                    {referencias.length}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "rgba(148, 163, 184, 0.18)"
                }}
              >
                <CardContent>
                  <Box component="p" sx={{ m: 0, color: "text.secondary" }}>
                    Evidencias / fotos
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      mt: 0.5,
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: "#0b5137"
                    }}
                  >
                    {evidencias.length}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <CrudTableCard
            loading={false}
            isEmpty={novedades.length === 0}
            emptyTitle="Sin novedades asociadas"
            emptyDescription="No hay novedades registradas para este reporte diario."
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
            emptyDescription="No hay referencias que conecten evidencias con este reporte diario."
            minWidth={850}
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
            emptyDescription="No hay evidencias relacionadas con este reporte diario."
            minWidth={950}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código evidencia</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Archivo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha captura</TableCell>
                  <TableCell>URL</TableCell>
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
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "middle"
                        }}
                      >
                        {row.eviUrlarchivoEvid}
                      </Box>
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