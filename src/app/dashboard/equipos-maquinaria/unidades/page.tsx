"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { UnidadMedidaForm } from "../../../../components/equipos/UnidadMedidaForm";
import { equiposMaquinariaService } from "../../../../services/equipos.service";
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

      const response = await equiposMaquinariaService.unidades.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
        "No fue posible cargar las unidades de medida."
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

  const handleEdit = (row: UnidadMedidaDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: UnidadMedidaDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvTipunidamedUnme) {
        await equiposMaquinariaService.unidades.update(
          selectedRow.prvTipunidamedUnme,
          data
        );

        setSuccess("Unidad de medida actualizada correctamente.");
      } else {
        await equiposMaquinariaService.unidades.create(data);
        setSuccess("Unidad de medida creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
        "No fue posible guardar la unidad de medida."
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

      const primaryKey = confirmAction.row.prvTipunidamedUnme;

      if (!primaryKey) {
        setError("La unidad seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposMaquinariaService.unidades.delete(primaryKey);
        setSuccess("Unidad de medida eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.prvEstadoregUnme === "1" ? "2" : "1";

        await equiposMaquinariaService.unidades.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado de la unidad actualizado correctamente.");
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
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Unidades de medida"
        subtitle="Administra unidades usadas para cantidades, tiempos, distancias y control operativo de equipos."
        action={
          <Button
            variant="contained"
            startIcon={<StraightenIcon />}
            onClick={handleCreate}
          >
            Crear unidad
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

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin unidades de medida"
        emptyDescription="No hay unidades registradas para mostrar."
        emptyActionLabel="Crear unidad"
        onEmptyAction={handleCreate}
        minWidth={850}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código / tipo unidad</TableCell>
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
                  <CrudActionButtons
                    disabled={saving}
                    onEdit={() => handleEdit(row)}
                    onChangeStatus={() =>
                      setConfirmAction({ type: "status", row })
                    }
                    onDelete={() => setConfirmAction({ type: "delete", row })}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrudTableCard>

      <UnidadMedidaForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={
          confirmAction?.type === "delete"
            ? "Eliminar unidad de medida"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta unidad de medida?"
            : "¿Confirmas que deseas cambiar el estado de esta unidad?"
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