"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { controlObrasService } from "../../../../services/controlObras.service";
import { AvanceObraDto } from "../../../../types/controlObras.types";

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "number") {
    return new Intl.NumberFormat("es-CO").format(value);
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function getValueByPossibleKeys(
  row: AvanceObraDto | null,
  keys: string[]
): unknown {
  if (!row) return undefined;

  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }

  return undefined;
}

function MetricBox({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)"
      }}
    >
      <CardContent>
        <Box
          component="p"
          sx={{
            m: 0,
            color: "text.secondary",
            fontSize: "0.84rem",
            fontWeight: 700
          }}
        >
          {label}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 0.5,
            fontSize: "1.55rem",
            fontWeight: 900,
            color: "#0b5137"
          }}
        >
          {value}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AvancesObraPage() {
  const [ordenKey, setOrdenKey] = useState("");
  const [rows, setRows] = useState<AvanceObraDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const firstRow = rows[0] ?? null;

  const avanceProgramado = getValueByPossibleKeys(firstRow, [
    "avanceProgramado",
    "avance_programado",
    "orsAvanceprogramado",
    "programado",
    "totalProgramado"
  ]);

  const avanceEjecutado = getValueByPossibleKeys(firstRow, [
    "avanceEjecutado",
    "avance_ejecutado",
    "orsAvanceejecutado",
    "ejecutado",
    "totalEjecutado"
  ]);

  const cumplimiento = getValueByPossibleKeys(firstRow, [
    "cumplimiento",
    "porcentajeCumplimiento",
    "porcCumplimiento",
    "orsPorccumplimiento",
    "porcentaje"
  ]);

  const valorTotal = getValueByPossibleKeys(firstRow, [
    "valorTotal",
    "valor_total",
    "totalValor",
    "orsValortotal"
  ]);

  const handleConsultar = async () => {
    const key = ordenKey.trim();

    if (!key) {
      setError("Debes ingresar el código de la orden de servicio.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await controlObrasService.avances.getOrdenConsolidado(
        key
      );

      const data = response.rspData ?? [];

      setRows(data.filter(Boolean));

      if (data.length === 0) {
        setSuccess("La consulta se ejecutó, pero no retornó datos de avance.");
      } else {
        setSuccess("Avance consolidado consultado correctamente.");
      }
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
        "No fue posible consultar el avance consolidado de la orden."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const fieldNames = rows.length > 0 ? Object.keys(rows[0] ?? {}) : [];

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Avance consolidado de obra"
        subtitle="Consulta el avance planeado contra ejecutado por orden de servicio."
        action={
          <Button
            variant="contained"
            startIcon={<TrendingUpIcon />}
            onClick={handleConsultar}
            disabled={loading}
          >
            Consultar avance
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid
            container
            spacing={2}
            component="div"
            sx={{ alignItems: "center" }}
          >
            <Grid size={{ xs: 12, md: 8 }} component="div">
              <TextField
                fullWidth
                size="small"
                label="Código orden de servicio"
                placeholder="Ejemplo: ORS-001"
                value={ordenKey}
                onChange={event => setOrdenKey(event.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} component="div">
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={handleConsultar}
                disabled={loading}
              >
                Consultar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }} component="div">
            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
              <MetricBox
                label="Avance programado"
                value={formatValue(avanceProgramado)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
              <MetricBox
                label="Avance ejecutado"
                value={formatValue(avanceEjecutado)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
              <MetricBox
                label="Cumplimiento"
                value={
                  cumplimiento === undefined || cumplimiento === null
                    ? "-"
                    : `${formatValue(cumplimiento)}%`
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
              <MetricBox label="Valor total" value={formatValue(valorTotal)} />
            </Grid>
          </Grid>

          <CrudTableCard
            loading={false}
            isEmpty={rows.length === 0}
            emptyTitle="Sin avance consultado"
            emptyDescription="Ingresa una orden de servicio y consulta el avance consolidado."
            minWidth={1100}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {fieldNames.map(field => (
                    <TableCell key={field}>{field}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    {fieldNames.map(field => (
                      <TableCell key={field}>
                        {formatValue(row[field])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CrudTableCard>
        </>
      )}
    </Box>
  );
}