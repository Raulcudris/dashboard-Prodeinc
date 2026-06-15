"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { LoadingBox } from "../../../components/common/LoadingBox";
import { EmptyState } from "../../../components/common/EmptyState";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { ReporteDiarioForm } from "../../../components/control-obras/ReporteDiarioForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { ReporteDiarioDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ReporteDiarioDto }
  | { type: "status"; row: ReporteDiarioDto }
  | null;

export default function ReporteDiarioPage() {
  const [rows, setRows] = useState<ReporteDiarioDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReporteDiarioDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyPdia,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyPsem,
        row.orsObservacionPdia,
        row.orsEstadoregPdia
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.reportesDiarios.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar los reportes diarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleSubmit = async (data: ReporteDiarioDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPdia) {
        await controlObrasService.reportesDiarios.update(
          selectedRow.orsPrimarykeyPdia,
          data
        );
        setSuccess("Reporte diario actualizado correctamente.");
      } else {
        await controlObrasService.reportesDiarios.create(data);
        setSuccess("Reporte diario creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar el reporte diario.");
    } finally {
      setSaving(false);
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const primaryKey = confirmAction.row.orsPrimarykeyPdia;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.reportesDiarios.delete(primaryKey);
        setSuccess("Reporte diario eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.orsEstadoregPdia === "1" ? "2" : "1";
        await controlObrasService.reportesDiarios.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado actualizado correctamente.");
      }

      setConfirmAction(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible ejecutar la acción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Reporte diario"
        subtitle="Registro diario de ejecución, cantidades realizadas, observaciones y soportes."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setOpenForm(true);
            }}
          >
            Crear reporte
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={<Button variant="outlined" onClick={loadRows}>Actualizar</Button>}
      />

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin reportes diarios"
              description="No hay reportes diarios registrados."
              actionLabel="Crear reporte"
              onAction={() => setOpenForm(true)}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código reporte</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan semanal</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cantidad ejecutada</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.orsPrimarykeyPdia ?? row.orsIdentifkeyPdia}>
                    <TableCell>{row.orsIdentifkeyPdia}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsFechareportPdia}</TableCell>
                    <TableCell>{row.orsEjecutunidadPdia}</TableCell>
                    <TableCell><StatusChip value={row.orsEstadoregPdia} /></TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => { setSelectedRow(row); setOpenForm(true); }}>
                        Editar
                      </Button>
                      <Button size="small" onClick={() => setConfirmAction({ type: "status", row })}>
                        Estado
                      </Button>
                      <Button size="small" color="error" onClick={() => setConfirmAction({ type: "delete", row })}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ReporteDiarioForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar reporte" : "Cambiar estado"}
        message={confirmAction?.type === "delete" ? "¿Confirmas que deseas eliminar este reporte diario?" : "¿Confirmas que deseas cambiar el estado?"}
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}