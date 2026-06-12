"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Typography } from "@mui/material";
//import PageHeader from "@/components/layout/PageHeader";

export default function UnidadesMedidaPage() {
  return (
    <Box>
      <PageHeader
        title="Unidades de medida"
        subtitle="Gestión de unidades como HORA, DÍA, KM, M3 o ML."
      />

      <Typography color="text.secondary">
        Aquí se administrarán las unidades de medida usadas para controlar
        maquinaria, vehículos, herramientas y actividades de obra.
      </Typography>
    </Box>
  );
}