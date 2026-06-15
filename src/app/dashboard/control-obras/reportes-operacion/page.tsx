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
import Link from "next/link";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { EmptyState } from "../../../../components/common/EmptyState";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { ReporteOperacionForm } from "../../../../components/control-obras/ReporteOperacionForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { ReporteOperacionDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ReporteOperacionDto }
  | { type: "status"; row: ReporteOperacionDto }
  | null;

export default function ReportesOperacionPage() {
  const [rows, setRows] = useState<ReporteOperacionDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReporteOperacionDto | null>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyRope,
        row.orsIdentifkeyOrde,
        row.orsFechareportRope,
        row.orsObservacionRope,
        row.orsTiporegistRope,
        row.orsEstadoregRope
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.reportesOperacion.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los reportes de operación."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenForm(true);
  };

  const handleEdit = (row: ReporteOperacionDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: ReporteOperacionDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyRope) {
        await controlObrasService.reportesOperacion.update(
          selectedRow.orsPrimarykeyRope,
          data
        );
        setSuccess("Reporte de operación actualizado correctamente.");
      } else {
        await controlObrasService.reportesOperacion.create(data);
        setSuccess("Reporte de operación creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el reporte de operación."
      );
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

      const primaryKey = confirmAction.row.orsPrimarykeyRope;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.reportesOperacion.delete(primaryKey);
        setSuccess("Reporte de operación eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregRope === "1" ? "2" : "1";

        await controlObrasService.reportesOperacion.changeStatus(
          primaryKey,
          nextStatus
        );
        setSuccess("Estado del reporte actualizado correctamente.");
      }

      setConfirmAction(null);
      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible ejecutar la acción."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Reportes de operación"
        subtitle="Registro operativo de actividades, órdenes, fechas y observaciones."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear reporte
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

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar reporte"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={
          <Button variant="outlined" onClick={loadRows}>
            Actualizar
          </Button>
        }
      />

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin reportes de operación"
              description="No hay reportes de operación registrados."
              actionLabel="Crear reporte"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código reporte</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Observación</TableCell>
                  <TableCell>Tipo registro</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow
                    key={row.orsPrimarykeyRope ?? row.orsIdentifkeyRope}
                  >
                    <TableCell>{row.orsIdentifkeyRope}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsFechareportRope}</TableCell>
                    <TableCell>{row.orsObservacionRope}</TableCell>
                    <TableCell>{row.orsTiporegistRope}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregRope} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        component={Link}
                        href={`/dashboard/control-obras/reportes-operacion/${row.orsIdentifkeyRope}`}
                      >
                        Ver
                      </Button>

                      <Button size="small" onClick={() => handleEdit(row)}>
                        Editar
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          setConfirmAction({ type: "status", row })
                        }
                      >
                        Estado
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          setConfirmAction({ type: "delete", row })
                        }
                      >
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

      <ReporteOperacionForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={
          confirmAction?.type === "delete"
            ? "Eliminar reporte de operación"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este reporte de operación?"
            : "¿Confirmas que deseas cambiar el estado de este reporte?"
        }
        confirmText={
          confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"
        }
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}