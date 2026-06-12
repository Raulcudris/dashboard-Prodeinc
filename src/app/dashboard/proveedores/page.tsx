"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Typography } from "@mui/material";
//import PageHeader from "@/components/layout/PageHeader";

export default function ProveedoresPage() {
  return (
    <Box>
      <PageHeader
        title="Proveedores"
        subtitle="Gestión de proveedores de maquinaria, suministros y servicios."
      />

      <Typography color="text.secondary">
        Aquí se administrarán los proveedores registrados en el sistema.
      </Typography>
    </Box>
  );
}