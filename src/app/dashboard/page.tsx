"use client";

import Link from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";

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

import { PageHeader } from "../../components/layout/PageHeader";
import { MetricCard } from "../../components/common/MetricCard";

const flujoPrincipal = [
  {
    title: "1. Órdenes de servicio",
    description: "Registro base contractual y operativo de la obra.",
    href: "/dashboard/ordenes",
    icon: <AssignmentIcon />
  },
  {
    title: "2. Sitios / puntos de trabajo",
    description: "Ubicación y puntos donde se ejecutan actividades.",
    href: "/dashboard/sitios",
    icon: <PlaceIcon />
  },
  {
    title: "3. Plan de trabajo proyectado",
    description: "Actividades, cantidades y valores proyectados.",
    href: "/dashboard/planes",
    icon: <CalendarMonthIcon />
  },
  {
    title: "4. Plan semanal",
    description: "Programación semanal de ejecución.",
    href: "/dashboard/planes-semanales",
    icon: <CalendarMonthIcon />
  },
  {
    title: "5. Reporte diario",
    description: "Registro diario de ejecución en campo.",
    href: "/dashboard/reportes",
    icon: <DescriptionIcon />
  },
  {
    title: "6. Novedades",
    description: "Eventos, observaciones o situaciones de obra.",
    href: "/dashboard/novedades",
    icon: <WarningAmberIcon />
  },
  {
    title: "7. Evidencias / Fotos",
    description: "Soportes fotográficos, documentales y archivos.",
    href: "/dashboard/evidencias/evidencias",
    icon: <PhotoCameraIcon />
  }
];

export default function DashboardPage() {
  return (
    <Box>
      <PageHeader
        title="Dashboard principal"
        subtitle="Control del flujo operativo de obra civil: orden, sitios, planeación, ejecución, novedades y evidencias."
      />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Órdenes activas"
            value="0"
            icon={<AssignmentIcon />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Sitios registrados"
            value="0"
            icon={<PlaceIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Reportes diarios"
            value="0"
            icon={<DescriptionIcon />}
            color="secondary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Novedades abiertas"
            value="0"
            icon={<WarningAmberIcon />}
            color="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Evidencias cargadas"
            value="0"
            icon={<PhotoCameraIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Avance promedio"
            value="0%"
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Proveedores"
            value="0"
            icon={<BusinessIcon />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Equipos registrados"
            value="0"
            icon={<InventoryIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
        Flujo principal de obra
      </Typography>

      <Grid container spacing={2}>
        {flujoPrincipal.map(item => (
          <Grid key={item.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardActionArea component={Link} href={item.href}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(11, 61, 46, 0.08)",
                        color: "primary.main"
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {item.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen operativo
              </Typography>

              <Typography color="text.secondary">
                Aquí se consolidará el estado de las órdenes, planes, reportes
                diarios, novedades, evidencias y avance de obra.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Apoyo operativo
              </Typography>

              <Stack spacing={1}>
                <Typography color="text.secondary">
                  Proveedores, equipos, unidades de medida, reportes de
                  operación y detalles de equipos estarán disponibles como
                  módulos de soporte.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    color: "primary.main",
                    alignItems: "center"
                  }}
                >
                  <BuildIcon fontSize="small" />
                  <Typography variant="body2" fontWeight={700}>
                    Maquinaria y operación conectadas al flujo de obra.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}