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
import BusinessIcon from "@mui/icons-material/Business";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { ProveedorForm } from "../../../components/proveedores/ProveedorForm";
import { proveedoresService } from "../../../services/proveedores.service";
import { ProveedorDto } from "../../../types/proveedores.types";

type ConfirmAction =
  | { type: "delete"; row: ProveedorDto }
  | { type: "status"; row: ProveedorDto }
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

function buildRowKey(row: ProveedorDto, index: number) {
  return (
    row.prvPrimarykeyMprv ??
    row.prvIdentifkeyMprv ??
    row.prvNumeronitMprv ??
    `MPRV-${index}`
  );
}

export default function ProveedoresPage() {
  const [rows, setRows] = useState<ProveedorDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProveedorDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.prvIdentifkeyMprv,
        row.prvNumeronitMprv,
        row.prvRazonsocialMprv,
        row.prvObjetosocialMprv,
        row.prvDireccionMprv,
        row.prvTelefonoMprv,
        row.prvCorreoMprv,
        row.prvEstadoregMprv
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await proveedoresService.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los proveedores."
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

  const handleEdit = (row: ProveedorDto) => {
    openModalSafely(() => {
      setSelectedRow(row);
      setOpenForm(true);
    });
  };

  const handleChangeStatus = (row: ProveedorDto) => {
    openModalSafely(() => {
      setConfirmAction({ type: "status", row });
    });
  };

  const handleDelete = (row: ProveedorDto) => {
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

  const handleSubmit = async (data: ProveedorDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyMprv) {
        await proveedoresService.update(selectedRow.prvPrimarykeyMprv, data);
        setSuccess("Proveedor actualizado correctamente.");
      } else {
        await proveedoresService.create(data);
        setSuccess("Proveedor creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el proveedor."
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

      const primaryKey = confirmAction.row.prvPrimarykeyMprv;

      if (!primaryKey) {
        setError("El proveedor seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await proveedoresService.delete(primaryKey);
        setSuccess("Proveedor eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.prvEstadoregMprv === "1" ? "2" : "1";

        await proveedoresService.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado del proveedor actualizado correctamente.");
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
        title="Proveedores"
        subtitle="Administra proveedores, terceros, empresas de maquinaria, materiales, servicios y suministros asociados a la operación de obra."
        action={
          <Button
            variant="contained"
            startIcon={<BusinessIcon />}
            onMouseDown={event => event.preventDefault()}
            onClick={handleCreate}
          >
            Crear proveedor
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
            label="Buscar proveedor"
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
        emptyTitle="Sin proveedores"
        emptyDescription="No hay proveedores registrados para mostrar."
        emptyActionLabel="Crear proveedor"
        onEmptyAction={handleCreate}
        minWidth={1200}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>NIT</TableCell>
              <TableCell>Razón social</TableCell>
              <TableCell>Objeto social</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                <TableCell>{row.prvNumeronitMprv}</TableCell>
                <TableCell>{row.prvRazonsocialMprv}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 300,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.prvObjetosocialMprv}
                  </Box>
                </TableCell>
                <TableCell>{row.prvDireccionMprv}</TableCell>
                <TableCell>{row.prvTelefonoMprv}</TableCell>
                <TableCell>{row.prvCorreoMprv}</TableCell>
                <TableCell>
                  <StatusChip value={row.prvEstadoregMprv} />
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

      <ProveedorForm
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
            ? "Eliminar proveedor"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este proveedor?"
            : "¿Confirmas que deseas cambiar el estado de este proveedor?"
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