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
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { LoadingBox } from "../../../components/common/LoadingBox";
import { EmptyState } from "../../../components/common/EmptyState";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { OrdenServicioForm } from "../../../components/control-obras/OrdenServicioForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { OrdenServicioDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: OrdenServicioDto }
  | { type: "status"; row: OrdenServicioDto }
  | null;

export default function OrdenesServicioPage() {
  const [rows, setRows] = useState<OrdenServicioDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrdenServicioDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) {
      return rows;
    }

    return rows.filter(row =>
      [
        row.orsIdentifkeyOrde,
        row.orsCodservicioSebs,
        row.orsServiceventOrde,
        row.orsServiclugarOrde,
        row.prvIdentifkeyMprv,
        row.orsEstadoregOrde
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.ordenes.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar las órdenes.");
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

  const handleEdit = (row: OrdenServicioDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: OrdenServicioDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyOrde) {
        await controlObrasService.ordenes.update(
          selectedRow.orsPrimarykeyOrde,
          data
        );
        setSuccess("Orden actualizada correctamente.");
      } else {
        await controlObrasService.ordenes.create(data);
        setSuccess("Orden creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar la orden.");
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

      const row = confirmAction.row;
      const primaryKey = row.orsPrimarykeyOrde;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria para ejecutar la acción.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.ordenes.delete(primaryKey);
        setSuccess("Orden eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = row.orsEstadoregOrde === "1" ? "2" : "1";
        await controlObrasService.ordenes.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado de la orden actualizado correctamente.");
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
        title="Órdenes de servicio"
        subtitle="Registro y administración de órdenes de servicio para iniciar el flujo de obra."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear orden
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
              title="Sin órdenes"
              description="No hay órdenes de servicio para mostrar."
              actionLabel="Crear orden"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Lugar</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Fecha inicio</TableCell>
                  <TableCell>Fecha fin</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.orsPrimarykeyOrde ?? row.orsIdentifkeyOrde}>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsCodservicioSebs || row.orsServiceventOrde}</TableCell>
                    <TableCell>{row.orsServiclugarOrde}</TableCell>
                    <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                    <TableCell>{row.orsPlanfechiniOrde}</TableCell>
                    <TableCell>{row.orsPlanfechfinOrde}</TableCell>
                    <TableCell>{row.orsValortotalOrde ?? 0}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregOrde} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(row)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setConfirmAction({ type: "status", row })}
                      >
                        Estado
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setConfirmAction({ type: "delete", row })}
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

      <OrdenServicioForm
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
            ? "Eliminar orden"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta orden de servicio?"
            : "¿Confirmas que deseas cambiar el estado de esta orden?"
        }
        confirmText={
          confirmAction?.type === "delete"
            ? "Eliminar"
            : "Cambiar estado"
        }
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}