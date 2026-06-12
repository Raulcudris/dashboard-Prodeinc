"use client";

import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { PageHeader } from "../../../../components/layout/PageHeader";

export default function AvancesObraPage() {
  return (
    <Box>
      <PageHeader
        title="Avance de obra"
        subtitle="Consulta de avance planeado vs ejecutado por orden, plan de trabajo y plan semanal."
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Cantidad planeada
              </Typography>

              <Typography variant="h5" fontWeight={800}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Cantidad ejecutada
              </Typography>

              <Typography variant="h5" fontWeight={800}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Porcentaje de avance
              </Typography>

              <Typography variant="h5" fontWeight={800}>
                0%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography color="text.secondary">
          Aquí se mostrarán filtros por orden de servicio, plan de trabajo y
          plan semanal, junto con barras de progreso e indicadores financieros.
        </Typography>
      </Box>
    </Box>
  );
}