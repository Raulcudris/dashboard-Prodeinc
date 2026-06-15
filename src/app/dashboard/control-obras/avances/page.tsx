"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { MetricCard } from "../../../../components/common/MetricCard";
import { controlObrasService } from "../../../../services/controlObras.service";

type AvanceRow = Record<string, unknown>;

type ConsultaTipo = "orden" | "plan" | "planSemanal" | "ordenConsolidado";

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("es-CO").format(value);
  }

  return String(value);
}

function getFirstNumber(row: AvanceRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === "number") {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
}

export default function AvancesObraPage() {
  const [ordenKey, setOrdenKey] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [planSemanalKey, setPlanSemanalKey] = useState("");

  const [rows, setRows] = useState<AvanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [consultaActual, setConsultaActual] = useState("Sin consulta");
  const [error, setError] = useState<string | null>(null);

  const cantidadPlaneada = rows.reduce(
    (total, row) =>
      total +
      getFirstNumber(row, [
        "cantidadPlaneada",
        "orsCantidadplaneada",
        "orsCantidplaneada",
        "orsCantidunidadPlse",
        "orsCantidunidadRseq",
        "cantidad_programada"
      ]),
    0
  );

  const cantidadEjecutada = rows.reduce(
    (total, row) =>
      total +
      getFirstNumber(row, [
        "cantidadEjecutada",
        "orsCantidadejecutada",
        "orsEjecutunidadPlse",
        "orsEjecutunidadPdia",
        "cantidad_ejecutada"
      ]),
    0
  );

  const valorPlaneado = rows.reduce(
    (total, row) =>
      total +
      getFirstNumber(row, [
        "valorPlaneado",
        "orsValorplaneado",
        "orsValortotalPlse",
        "orsValortotalRseq",
        "valor_planeado"
      ]),
    0
  );

  const porcentajeAvance =
    cantidadPlaneada > 0
      ? Math.round((cantidadEjecutada / cantidadPlaneada) * 100)
      : 0;

  const consultarAvance = async (tipo: ConsultaTipo) => {
    try {
      setLoading(true);
      setError(null);

      let response:
        | {
            rspData?: unknown[];
          }
        | undefined;

      if (tipo === "orden") {
        response = await controlObrasService.avances.getByOrden(ordenKey);
        setConsultaActual(`Avance por orden: ${ordenKey}`);
      }

      if (tipo === "plan") {
        response = await controlObrasService.avances.getByPlan(planKey);
        setConsultaActual(`Avance por plan: ${planKey}`);
      }

      if (tipo === "planSemanal") {
        response = await controlObrasService.avances.getByPlanSemanal(
          planSemanalKey
        );
        setConsultaActual(`Avance por plan semanal: ${planSemanalKey}`);
      }

      if (tipo === "ordenConsolidado") {
        response = await controlObrasService.avances.getOrdenConsolidado(
          ordenKey
        );
        setConsultaActual(`Consolidado de orden: ${ordenKey}`);
      }

      const data = response?.rspData ?? [];
      setRows(data as AvanceRow[]);
    } catch (err) {
      setRows([]);
      setError(
        (err as { message?: string }).message ??
          "No fue posible consultar el avance de obra."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = rows.length > 0 ? Object.keys(rows[0]).slice(0, 10) : [];

  return (
    <Box>
      <PageHeader
        title="Avance de obra"
        subtitle="Consulta de avance planeado vs ejecutado por orden, plan de trabajo y plan semanal."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Cantidad planeada"
            value={cantidadPlaneada}
            icon={<TrendingUpIcon />}
            color="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Cantidad ejecutada"
            value={cantidadEjecutada}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Valor planeado"
            value={`$${new Intl.NumberFormat("es-CO").format(valorPlaneado)}`}
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard
            title="Avance"
            value={`${porcentajeAvance}%`}
            icon={<TrendingUpIcon />}
            color={porcentajeAvance >= 80 ? "success" : "warning"}
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            component="h2"
            sx={{
              m: 0,
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: 800,
              lineHeight: 1.4
            }}
          >
            Filtros de consulta
          </Box>

          <Box
            component="p"
            sx={{
              m: 0,
              mb: 2,
              color: "text.secondary"
            }}
          >
            Consulta el avance por orden de servicio, plan proyectado, plan
            semanal o consolidado de orden.
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                value={ordenKey}
                onChange={event => setOrdenKey(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Plan de trabajo"
                value={planKey}
                onChange={event => setPlanKey(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Plan semanal"
                value={planSemanalKey}
                onChange={event => setPlanSemanalKey(event.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={loading || !ordenKey}
              onClick={() => consultarAvance("orden")}
            >
              Buscar por orden
            </Button>

            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              disabled={loading || !planKey}
              onClick={() => consultarAvance("plan")}
            >
              Buscar por plan
            </Button>

            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              disabled={loading || !planSemanalKey}
              onClick={() => consultarAvance("planSemanal")}
            >
              Buscar por plan semanal
            </Button>

            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              disabled={loading || !ordenKey}
              onClick={() => consultarAvance("ordenConsolidado")}
            >
              Consolidado orden
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            component="h2"
            sx={{
              m: 0,
              mb: 1,
              fontSize: "1.25rem",
              fontWeight: 800,
              lineHeight: 1.4
            }}
          >
            Resultado
          </Box>

          <Box
            component="p"
            sx={{
              m: 0,
              mb: 2,
              color: "text.secondary"
            }}
          >
            {consultaActual}
          </Box>

          {loading ? (
            <LoadingBox />
          ) : rows.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                color: "text.secondary"
              }}
            >
              No hay resultados de avance para mostrar.
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map(column => (
                      <TableCell key={column}>
                        {formatValue(row[column])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}