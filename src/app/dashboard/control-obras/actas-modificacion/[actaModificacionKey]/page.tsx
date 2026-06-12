"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ActaModificacionDetallePage() {
  const params = useParams();
  const actaModificacionKey = params.actaModificacionKey as string;

  return (
    <Box>
      <PageHeader
        title="Detalle acta de modificación"
        subtitle={`Consulta detallada del acta ${actaModificacionKey}.`}
      />

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acta: {actaModificacionKey}
          </Typography>

          <Typography color="text.secondary">
            Aquí se mostrarán los datos generales del acta, detalles asociados,
            cantidades modificadas, valores actualizados y observaciones.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}