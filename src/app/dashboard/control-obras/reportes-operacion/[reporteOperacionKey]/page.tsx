"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function ReporteOperacionDetallePage() {
  const params = useParams();
  const reporteOperacionKey = params.reporteOperacionKey as string;

  return (
    <Box>
      <PageHeader
        title="Detalle reporte de operación"
        subtitle={`Consulta detallada del reporte ${reporteOperacionKey}.`}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reporte: {reporteOperacionKey}
          </Typography>

          <Typography color="text.secondary">
            Aquí se mostrarán los datos generales del reporte, detalles de
            equipos asociados, resumen de horas, valor ejecutado y evidencias.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}