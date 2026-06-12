"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function SitiosPuntosPage() {
  return (
    <Box>
      <PageHeader
        title="Sitios / puntos de trabajo"
        subtitle="Gestión de sitios o puntos asociados a una orden de servicio."
      />

      <Typography color="text.secondary">
        Aquí se registrarán los puntos de trabajo, nombre del sitio,
        ubicación, coordenadas, imagen de referencia y orden asociada.
      </Typography>
    </Box>
  );
}