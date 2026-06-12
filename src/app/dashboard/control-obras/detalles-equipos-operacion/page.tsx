"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DetallesEquiposOperacionPage() {
  return (
    <Box>
      <PageHeader
        title="Detalle equipo operación"
        subtitle="Registro del uso diario de maquinaria y equipos por reporte de operación."
      />

      <Typography color="text.secondary">
        Aquí se registrarán horómetros, kilometrajes, días trabajados, cantidad
        ejecutada, valor unitario y valor ejecutado.
      </Typography>
    </Box>
  );
}