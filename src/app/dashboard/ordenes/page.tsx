"use client";

import { Box, Typography } from "@mui/material";
import { PageHeader } from "../../../components/layout/PageHeader";

export default function OrdenesServicioPage() {
  return (
    <Box>
      <PageHeader
        title="Órdenes de servicio"
        subtitle="Registro y administración de órdenes de servicio para iniciar el flujo de obra."
      />

      <Typography color="text.secondary">
        Aquí se gestionarán las órdenes de servicio, proveedor asociado,
        fechas, objeto, valor base, IVA, valor total y estado del registro.
      </Typography>
    </Box>
  );
}