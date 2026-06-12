"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../../components/layout/PageHeader";

export default function EvidenciasFotosPage() {
  return (
    <Box>
      <PageHeader
        title="Evidencias / Fotos"
        subtitle="Gestión de fotos, videos, documentos y soportes asociados al flujo principal de obra."
      />

      <Typography color="text.secondary">
        Aquí se cargarán y consultarán evidencias fotográficas o documentales
        asociadas a reportes diarios, novedades, actividades, sitios o actas.
      </Typography>
    </Box>
  );
}