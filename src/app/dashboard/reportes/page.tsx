"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function ReporteDiarioPage() {
  return (
    <Box>
      <PageHeader
        title="Reporte diario"
        subtitle="Registro diario de ejecución, cantidades realizadas, observaciones y soportes."
      />

      <Typography color="text.secondary">
        Aquí se registrarán los reportes diarios asociados al plan semanal,
        permitiendo controlar la ejecución real en campo.
      </Typography>
    </Box>
  );
}