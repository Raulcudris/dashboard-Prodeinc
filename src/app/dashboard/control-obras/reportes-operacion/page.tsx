"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Typography } from "@mui/material";

export default function ReportesOperacionPage() {
  return (
    <Box>
      <PageHeader
        title="Reportes de operación"
        subtitle="Registro y consulta de reportes operativos diarios por orden, punto, proveedor y fecha."
      />

      <Typography color="text.secondary">
        Aquí se administrarán los reportes de operación asociados a órdenes de
        servicio, planes semanales, puntos de trabajo y proveedores.
      </Typography>
    </Box>
  );
}