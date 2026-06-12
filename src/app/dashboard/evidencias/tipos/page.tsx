"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";

export default function TiposEvidenciaPage() {
  return (
    <Box>
      <PageHeader
        title="Tipos de evidencia"
        subtitle="Gestión de tipos como FOTO, VIDEO, DOCUMENTO, ACTA o PLANO."
      />

      <Typography color="text.secondary">
        Aquí se administrarán los tipos de evidencia permitidos para soportar
        reportes, novedades, actas, equipos y proveedores.
      </Typography>
    </Box>
  );
}