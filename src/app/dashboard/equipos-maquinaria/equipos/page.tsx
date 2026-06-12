"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Typography } from "@mui/material";


export default function EquiposPage() {
  return (
    <Box>
      <PageHeader
        title="Inventario de equipos"
        subtitle="Gestión de maquinaria, vehículos, herramientas y equipos disponibles para obra."
      />

      <Typography color="text.secondary">
        Aquí se controlará el inventario de equipos, su proveedor, tipo de
        equipo, estado operativo y disponibilidad.
      </Typography>
    </Box>
  );
}