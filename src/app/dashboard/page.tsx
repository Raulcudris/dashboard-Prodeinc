"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaceIcon from "@mui/icons-material/Place";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReportIcon from "@mui/icons-material/Report";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";

import { PageHeader } from "../../components/layout/PageHeader";
import { LoadingBox } from "../../components/common/LoadingBox";
import { controlObrasService } from "../../services/controlObras.service";
import { evidenciasService } from "../../services/evidencias.service";

interface DashboardCounts {
  ordenes: number;
  sitios: number;
  planes: number;
  planesSemanales: number;
  reportesDiarios: number;
  novedades: number;
  evidencias: number;
  reportesOperacion: number;
  resumenEquipos: number;
  actasModificacion: number;
}

const initialCounts: DashboardCounts = {
  ordenes: 0,
  sitios: 0,
  planes: 0,
  planesSemanales: 0,
  reportesDiarios: 0,
  novedades: 0,
  evidencias: 0,
  reportesOperacion: 0,
  resumenEquipos: 0,
  actasModificacion: 0
};

async function getCount(
  loader: () => Promise<{
    rspPagination?: { totalResults?: number };
    rspData?: unknown[];
  }>
) {
  try {
    const response = await loader();

    return (
      response.rspPagination?.totalResults ??
      response.rspData?.length ??
      0
    );
  } catch {
    return 0;
  }
}

function MetricCard({
  title,
  value,
  description,
  icon,
  href
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  href: string;
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)"
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Box>
            <Box
              component="p"
              sx={{
                m: 0,
                color: "text.secondary",
                fontSize: "0.85rem",
                fontWeight: 750
              }}
            >
              {title}
            </Box>

            <Box
              component="p"
              sx={{
                m: 0,
                mt: 0.75,
                fontSize: "2rem",
                fontWeight: 950,
                color: "#0b5137",
                lineHeight: 1
              }}
            >
              {value}
            </Box>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "rgba(11, 81, 55, 0.09)",
              color: "#0b5137",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                fontSize: 24
              }
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 1.5,
            minHeight: 42,
            color: "text.secondary",
            fontSize: "0.86rem",
            lineHeight: 1.45
          }}
        >
          {description}
        </Box>

        <Button
          component={Link}
          href={href}
          size="small"
          sx={{ mt: 1 }}
        >
          Ver módulo
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon
}: {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)"
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 1
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              bgcolor: "rgba(11, 81, 55, 0.09)",
              color: "#0b5137",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>

          <Box
            component="h3"
            sx={{
              m: 0,
              fontSize: "1rem",
              fontWeight: 900,
              color: "text.primary"
            }}
          >
            {title}
          </Box>
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            color: "text.secondary",
            fontSize: "0.88rem",
            lineHeight: 1.5,
            minHeight: 44
          }}
        >
          {description}
        </Box>

        <Button
          component={Link}
          href={href}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
        >
          Abrir
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>(initialCounts);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setWarning(null);

      const [
        ordenes,
        sitios,
        planes,
        planesSemanales,
        reportesDiarios,
        novedades,
        evidencias,
        reportesOperacion,
        resumenEquipos,
        actasModificacion
      ] = await Promise.all([
        getCount(() =>
          controlObrasService.ordenes.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.sitios.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.planes.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.planesSemanales.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.reportesDiarios.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.novedades.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          evidenciasService.evidencias.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.reportesOperacion.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.resumenEquipos.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        ),
        getCount(() =>
          controlObrasService.actasModificacion.getPages({
            currentPage: 1,
            pageSize: 1,
            parameter: "TEXT",
            filter: ""
          })
        )
      ]);

      setCounts({
        ordenes,
        sitios,
        planes,
        planesSemanales,
        reportesDiarios,
        novedades,
        evidencias,
        reportesOperacion,
        resumenEquipos,
        actasModificacion
      });
    } catch {
      setWarning(
        "No fue posible cargar todos los indicadores del dashboard. Algunos valores pueden aparecer en cero."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Dashboard operativo"
        subtitle="Vista general del control de obra, reportes diarios, novedades, evidencias, equipos y seguimiento."
        action={
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadDashboard}
            disabled={loading}
          >
            Actualizar
          </Button>
        }
      />

      {warning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {warning}
        </Alert>
      )}

      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Órdenes"
                value={counts.ordenes}
                description="Órdenes de servicio registradas como base contractual y operativa."
                icon={<AssignmentIcon />}
                href="/dashboard/ordenes"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Sitios / puntos"
                value={counts.sitios}
                description="Frentes, puntos o sitios de trabajo asociados a las órdenes."
                icon={<PlaceIcon />}
                href="/dashboard/sitios"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Planes"
                value={counts.planes}
                description="Actividades planeadas por sitio, equipo, cantidad y valor."
                icon={<FactCheckIcon />}
                href="/dashboard/planes"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Planes semanales"
                value={counts.planesSemanales}
                description="Programación semanal de actividades planeadas contra ejecutadas."
                icon={<CalendarMonthIcon />}
                href="/dashboard/planes-semanales"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Reportes diarios"
                value={counts.reportesDiarios}
                description="Registros diarios de ejecución, observaciones y cantidades ejecutadas."
                icon={<AssignmentIcon />}
                href="/dashboard/reportes"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Novedades"
                value={counts.novedades}
                description="Eventos, alertas, observaciones y situaciones relevantes de obra."
                icon={<ReportIcon />}
                href="/dashboard/novedades"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Evidencias"
                value={counts.evidencias}
                description="Fotos, archivos y soportes documentales asociados a registros."
                icon={<PhotoLibraryIcon />}
                href="/dashboard/evidencias/evidencias"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Operación equipos"
                value={counts.reportesOperacion}
                description="Reportes de operación de maquinaria, vehículos y equipos."
                icon={<PrecisionManufacturingIcon />}
                href="/dashboard/control-obras/reportes-operacion"
              />
            </Grid>
          </Grid>

          <Box
            component="h2"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 950,
              color: "text.primary"
            }}
          >
            Accesos rápidos de trazabilidad
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Trazabilidad por orden"
                description="Consulta una orden y revisa sitios, planes, reportes, novedades, equipos y actas."
                icon={<AssignmentIcon />}
                href="/dashboard/ordenes"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Seguimiento de reportes diarios"
                description="Revisa reportes diarios con novedades y evidencias asociadas."
                icon={<FactCheckIcon />}
                href="/dashboard/reportes"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Control de novedades"
                description="Consulta novedades de obra y sus evidencias fotográficas o documentales."
                icon={<ReportIcon />}
                href="/dashboard/novedades"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Evidencias / fotos"
                description="Consulta archivos cargados y dónde están referenciados dentro del sistema."
                icon={<PhotoLibraryIcon />}
                href="/dashboard/evidencias/evidencias"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Resumen de equipos"
                description={`Consulta equipos asociados a órdenes. Registros actuales: ${counts.resumenEquipos}.`}
                icon={<PrecisionManufacturingIcon />}
                href="/dashboard/control-obras/resumen-equipos"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <QuickActionCard
                title="Avance de obra"
                description={`Revisa avance planeado contra ejecutado y actas relacionadas: ${counts.actasModificacion}.`}
                icon={<TrendingUpIcon />}
                href="/dashboard/control-obras/avances"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}