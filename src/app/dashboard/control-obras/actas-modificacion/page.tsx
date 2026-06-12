"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ActasModificacionPage() {
  return (
    <Box>
      <PageHeader
        title="Actas de modificación"
        subtitle="Gestión de actas asociadas a modificaciones de órdenes de servicio."
      />

      <Typography color="text.secondary">
        Aquí se administrarán las actas de modificación, su estado, fecha,
        causal, valores modificados y observaciones.
      </Typography>
    </Box>
  );
}