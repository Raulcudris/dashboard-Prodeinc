"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ActasModificacionDetallesPage() {
  return (
    <Box>
      <PageHeader
        title="Detalle actas de modificación"
        subtitle="Detalle de equipos, cantidades y valores asociados a actas de modificación."
      />

      <Typography color="text.secondary">
        Aquí se administrarán los detalles de cada acta de modificación,
        incluyendo tipo de equipo, descripción, cantidades y valores.
      </Typography>
    </Box>
  );
}