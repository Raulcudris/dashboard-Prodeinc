"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ReferenciasEvidenciaPage() {
  return (
    <Box>
      <PageHeader
        title="Referencias de evidencia"
        subtitle="Relación entre evidencias y registros origen del sistema."
      />

      <Typography color="text.secondary">
        Aquí se relacionarán evidencias con reportes de operación, detalles de
        equipos, actas de modificación, equipos o proveedores.
      </Typography>
    </Box>
  );
}