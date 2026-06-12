"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Typography } from "@mui/material";

export default function TiposEquipoPage() {
  return (
    <Box>
      <PageHeader
        title="Tipos de equipo"
        subtitle="Clasificación de maquinaria y equipos por unidad de medida."
      />

      <Typography color="text.secondary">
        Aquí se administrarán tipos como excavadora, volqueta, compactador,
        retroexcavadora, motoniveladora, herramienta o vehículo.
      </Typography>
    </Box>
  );
}