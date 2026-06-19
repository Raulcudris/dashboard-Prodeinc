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
import CategoryIcon from "@mui/icons-material/Category";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { TipoEquipoForm } from "../../../../components/equipos/TipoEquipoForm";
import { equiposMaquinariaService } from "../../../../services/equipos.service";
import { TipoEquipoDto } from "../../../../types/equipos.types";

type ConfirmAction =
  | { type: "delete"; row: TipoEquipoDto }
  | { type: "status"; row: TipoEquipoDto }
  | null;

function blurActiveElement() {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function openModalSafely(callback: () => void) {
  blurActiveElement();
  window.requestAnimationFrame(() => callback());
}

function buildRowKey(row: TipoEquipoDto, index: number) {
  return (
    row.prvPrimarykeyTieq ??
    row.prvTipoequipoTieq ??
    `TIEQ-${index}`
  );
}

export default function TiposEquipoPage() {
  const [rows, setRows] = useState<TipoEquipoDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TipoEquipoDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.prvTipoequipoTieq,
        row.prvDescripcionTieq,
        row.prvIdentifkeyUnme,
        row.prvTiporegistTieq,
        row.prvEstadoregTieq
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await equiposMaquinariaService.tipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los tipos de equipo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleCreate = () => {
    openModalSafely(() => {
      setSelectedRow(null);
      setOpenForm(true);
    });
  };

  const handleEdit = (row: TipoEquipoDto) => {
    openModalSafely(() => {
      setSelectedRow(row);
      setOpenForm(true);
    });
  };

  const handleChangeStatus = (row: TipoEquipoDto) => {
    openModalSafely(() => {
      setConfirmAction({ type: "status", row });
    });
  };

  const handleDelete = (row: TipoEquipoDto) => {
    openModalSafely(() => {
      setConfirmAction({ type: "delete", row });
    });
  };

  const handleCloseForm = () => {
    if (saving) return;

    blurActiveElement();
    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleCloseConfirm = () => {
    if (saving) return;

    blurActiveElement();
    setConfirmAction(null);
  };

  const handleSubmit = async (data: TipoEquipoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyTieq) {
        await equiposMaquinariaService.tipos.update(
          selectedRow.prvPrimarykeyTieq,
          data
        );

        setSuccess("Tipo de equipo actualizado correctamente.");
      } else {
        await equiposMaquinariaService.tipos.create(data);
        setSuccess("Tipo de equipo creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el tipo de equipo."
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

      const primaryKey = confirmAction.row.prvPrimarykeyTieq;

      if (!primaryKey) {
        setError("El tipo de equipo seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposMaquinariaService.tipos.delete(primaryKey);
        setSuccess("Tipo de equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.prvEstadoregTieq === "1" ? "2" : "1";

        await equiposMaquinariaService.tipos.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del tipo de equipo actualizado correctamente.");
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
        title="Tipos de equipo"
        subtitle="Administra el catálogo de tipos de maquinaria, vehículos, herramientas y equipos usados en la operación de obra."
        action={
          <Button
            variant="contained"
            startIcon={<CategoryIcon />}
            onMouseDown={event => event.preventDefault()}
            onClick={handleCreate}
          >
            Crear tipo
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
            label="Buscar tipo"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={
          <Button
            variant="outlined"
            onMouseDown={event => event.preventDefault()}
            onClick={loadRows}
          >
            Actualizar
          </Button>
        }
      />

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin tipos de equipo"
        emptyDescription="No hay tipos de equipo registrados para mostrar."
        emptyActionLabel="Crear tipo"
        onEmptyAction={handleCreate}
        minWidth={950}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo equipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Tipo registro interno</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.prvTipoequipoTieq}</TableCell>
                <TableCell>{row.prvDescripcionTieq}</TableCell>
                <TableCell>{row.prvIdentifkeyUnme}</TableCell>
                <TableCell>{row.prvTiporegistTieq}</TableCell>
                <TableCell>
                  <StatusChip value={row.prvEstadoregTieq} />
                </TableCell>
                <TableCell align="right">
                  <CrudActionButtons
                    disabled={saving}
                    onEdit={() => handleEdit(row)}
                    onChangeStatus={() => handleChangeStatus(row)}
                    onDelete={() => handleDelete(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrudTableCard>

      <TipoEquipoForm
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
            ? "Eliminar tipo de equipo"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este tipo de equipo?"
            : "¿Confirmas que deseas cambiar el estado de este tipo de equipo?"
        }
        confirmText={
          confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"
        }
        onClose={handleCloseConfirm}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}