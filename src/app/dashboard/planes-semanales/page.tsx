"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function PlanesSemanalesPage() {
  return (
    <Box>
      <PageHeader
        title="Plan semanal"
        subtitle="Programación semanal de cantidades, valores y actividades a ejecutar."
      />

      <Typography color="text.secondary">
        Aquí se gestionará el plan semanal asociado al plan de trabajo
        proyectado y a la orden de servicio.
      </Typography>
    </Box>
  );
}