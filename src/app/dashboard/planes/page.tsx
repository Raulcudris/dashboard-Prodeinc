"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function PlanTrabajoProyectadoPage() {
  return (
    <Box>
      <PageHeader
        title="Plan de trabajo proyectado"
        subtitle="Planeación de actividades, cantidades, equipos, unidades y valores por orden y punto de trabajo."
      />

      <Typography color="text.secondary">
        Aquí se administrará el plan de trabajo proyectado antes de pasar a la
        programación semanal de ejecución.
      </Typography>
    </Box>
  );
}