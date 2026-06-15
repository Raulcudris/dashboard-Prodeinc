"use client";

import Link from "next/link";
import { Box, Card, CardContent, Grid } from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import StraightenIcon from "@mui/icons-material/Straighten";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import ArticleIcon from "@mui/icons-material/Article";

import { PageHeader } from "../../components/layout/PageHeader";
import { MetricCard } from "../../components/common/MetricCard";

const grupos = [
  {
    title: "Control de obra",
    description: "Módulos principales para administrar la operación diaria de obra.",
    items: [
      {
        title: "Órdenes de servicio",
        href: "/dashboard/ordenes",
        icon: <AssignmentIcon />,
        description: "Inicio del flujo contractual y operativo."
      },
      {
        title: "Sitios / puntos",
        href: "/dashboard/sitios",
        icon: <PlaceIcon />,
        description: "Ubicaciones y frentes de trabajo."
      },
      {
        title: "Planes y reportes",
        href: "/dashboard/planes",
        icon: <CalendarMonthIcon />,
        description: "Planeación proyectada, semanal y ejecución diaria."
      },
      {
        title: "Novedades y evidencias",
        href: "/dashboard/novedades",
        icon: <PhotoCameraIcon />,
        description: "Registro de novedades, fotos y soportes."
      }
    ]
  },
  {
    title: "Apoyo operativo",
    description: "Gestión de proveedores, equipos, unidades y operación de maquinaria.",
    items: [
      {
        title: "Proveedores",
        href: "/dashboard/proveedores",
        icon: <BusinessIcon />,
        description: "Administración de proveedores y terceros."
      },
      {
        title: "Unidades de medida",
        href: "/dashboard/equipos-maquinaria/unidades",
        icon: <StraightenIcon />,
        description: "Catálogo de unidades para cantidades y valores."
      },
      {
        title: "Inventario de equipos",
        href: "/dashboard/equipos-maquinaria/equipos",
        icon: <InventoryIcon />,
        description: "Maquinaria, herramientas y disponibilidad."
      },
      {
        title: "Operación de equipos",
        href: "/dashboard/control-obras/reportes-operacion",
        icon: <PrecisionManufacturingIcon />,
        description: "Reportes operativos y detalle de equipos."
      }
    ]
  },
  {
    title: "Seguimiento",
    description: "Consulta de avance, control de modificaciones y trazabilidad.",
    items: [
      {
        title: "Avance de obra",
        href: "/dashboard/control-obras/avances",
        icon: <TrendingUpIcon />,
        description: "Consulta planeado vs ejecutado."
      },
      {
        title: "Actas de modificación",
        href: "/dashboard/control-obras/actas-modificacion",
        icon: <ArticleIcon />,
        description: "Gestión de cambios y ajustes."
      },
      {
        title: "Detalle actas",
        href: "/dashboard/control-obras/actas-modificacion-detalles",
        icon: <BuildIcon />,
        description: "Detalle operativo y económico."
      }
    ]
  }
];

export default function DashboardPage() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        mx: 0,
        display: "block"
      }}
    >
      <PageHeader
        title="Dashboard principal"
        subtitle="Vista general de control para órdenes de servicio, ejecución de obra, apoyo operativo y seguimiento."
      />

      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          mb: 3
        }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Órdenes activas"
            value="0"
            icon={<AssignmentIcon />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Sitios registrados"
            value="0"
            icon={<PlaceIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Reportes diarios"
            value="0"
            icon={<DescriptionIcon />}
            color="secondary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Novedades abiertas"
            value="0"
            icon={<WarningAmberIcon />}
            color="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Evidencias cargadas"
            value="0"
            icon={<PhotoCameraIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Avance promedio"
            value="0%"
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Proveedores"
            value="0"
            icon={<BusinessIcon />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Equipos registrados"
            value="0"
            icon={<InventoryIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          width: "100%"
        }}
      >
        {grupos.map(grupo => (
          <Grid key={grupo.title} size={{ xs: 12 }}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 4,
                boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                border: "1px solid",
                borderColor: "rgba(148, 163, 184, 0.16)"
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Box
                  component="h2"
                  sx={{
                    m: 0,
                    fontSize: {
                      xs: "1.25rem",
                      md: "1.4rem"
                    },
                    fontWeight: 850,
                    color: "#0b2341",
                    lineHeight: 1.25
                  }}
                >
                  {grupo.title}
                </Box>

                <Box
                  component="p"
                  sx={{
                    m: 0,
                    mt: 0.5,
                    mb: 2,
                    color: "#5f6b7a",
                    fontSize: "0.94rem",
                    lineHeight: 1.45
                  }}
                >
                  {grupo.description}
                </Box>

                <Grid container spacing={2}>
                  {grupo.items.map(item => (
                    <Grid key={item.href} size={{ xs: 12, sm: 6, lg: 3 }}>
                      <Link href={item.href} style={{ textDecoration: "none" }}>
                        <Box
                          sx={{
                            height: "100%",
                            minHeight: 140,
                            border: "1px solid",
                            borderColor: "rgba(148, 163, 184, 0.25)",
                            borderRadius: 4,
                            p: 2,
                            bgcolor: "#ffffff",
                            transition: "all 0.18s ease",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                              borderColor: "rgba(11, 81, 55, 0.28)"
                            }
                          }}
                        >
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "rgba(11, 81, 55, 0.08)",
                              color: "#0b5137",
                              mb: 1.4,
                              "& svg": {
                                fontSize: "1.25rem"
                              }
                            }}
                          >
                            {item.icon}
                          </Box>

                          <Box
                            component="h3"
                            sx={{
                              m: 0,
                              fontSize: "0.98rem",
                              fontWeight: 850,
                              color: "#0f172a",
                              lineHeight: 1.3
                            }}
                          >
                            {item.title}
                          </Box>

                          <Box
                            component="p"
                            sx={{
                              m: 0,
                              mt: 0.7,
                              fontSize: "0.87rem",
                              color: "#64748b",
                              lineHeight: 1.45
                            }}
                          >
                            {item.description}
                          </Box>
                        </Box>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}