"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function NovedadesPage() {
  return (
    <Box>
      <PageHeader
        title="Novedades"
        subtitle="Registro de novedades, observaciones, eventos y situaciones presentadas en obra."
      />

      <Typography color="text.secondary">
        Aquí se administrarán novedades asociadas a órdenes, reportes diarios,
        actividades o puntos de trabajo.
      </Typography>
    </Box>
  );
}