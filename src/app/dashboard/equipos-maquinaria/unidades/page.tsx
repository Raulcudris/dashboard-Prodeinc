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
import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { EmptyState } from "../../../../components/common/EmptyState";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { UnidadMedidaForm } from "../../../../components/equipos/UnidadMedidaForm";
import { equiposService } from "../../../../services/equipos.service";
import { UnidadMedidaDto } from "../../../../types/equipos.types";

type ConfirmAction =
  | { type: "delete"; row: UnidadMedidaDto }
  | { type: "status"; row: UnidadMedidaDto }
  | null;

export default function UnidadesMedidaPage() {
  const [rows, setRows] = useState<UnidadMedidaDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UnidadMedidaDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.prvTipunidamedUnme,
        row.prvDescmedidaUnme,
        row.prvEstadoregUnme
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await equiposService.unidades.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar las unidades.");
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

  const handleEdit = (row: UnidadMedidaDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: UnidadMedidaDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvTipunidamedUnme) {
        await equiposService.unidades.update(selectedRow.prvTipunidamedUnme, data);
        setSuccess("Unidad actualizada correctamente.");
      } else {
        await equiposService.unidades.create(data);
        setSuccess("Unidad creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar la unidad.");
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

      const primaryKey = confirmAction.row.prvTipunidamedUnme;

      if (!primaryKey) {
        setError("La unidad no tiene código para ejecutar la acción.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposService.unidades.delete(primaryKey);
        setSuccess("Unidad eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.prvEstadoregUnme === "1" ? "2" : "1";
        await equiposService.unidades.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado de la unidad actualizado correctamente.");
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
        title="Unidades de medida"
        subtitle="Gestión de unidades como HORA, DÍA, KM, M3 o ML."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear unidad
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar unidad"
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
              title="Sin unidades"
              description="No hay unidades de medida registradas."
              actionLabel="Crear unidad"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código unidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.prvTipunidamedUnme}>
                    <TableCell>{row.prvTipunidamedUnme}</TableCell>
                    <TableCell>{row.prvDescmedidaUnme}</TableCell>
                    <TableCell>
                      <StatusChip value={row.prvEstadoregUnme} />
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

      <UnidadMedidaForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar unidad" : "Cambiar estado"}
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta unidad de medida?"
            : "¿Confirmas que deseas cambiar el estado de esta unidad?"
        }
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}