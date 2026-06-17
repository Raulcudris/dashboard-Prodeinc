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
import { TipoEvidenciaForm } from "../../../../components/evidencias/TipoEvidenciaForm";
import { evidenciasService } from "../../../../services/evidencias.service";
import { TipoEvidenciaDto } from "../../../../types/evidencias.types";

type ConfirmAction =
  | { type: "delete"; row: TipoEvidenciaDto }
  | { type: "status"; row: TipoEvidenciaDto }
  | null;

export default function TiposEvidenciaPage() {
  const [rows, setRows] = useState<TipoEvidenciaDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TipoEvidenciaDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.eviIdentifkeyTiev,
        row.eviDescripcionTiev,
        row.eviTiporegistTiev,
        row.eviEstadoregTiev
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await evidenciasService.tipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los tipos de evidencia."
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

  const handleEdit = (row: TipoEvidenciaDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: TipoEvidenciaDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.eviPrimarykeyTiev) {
        await evidenciasService.tipos.update(
          selectedRow.eviPrimarykeyTiev,
          data
        );

        setSuccess("Tipo de evidencia actualizado correctamente.");
      } else {
        await evidenciasService.tipos.create(data);
        setSuccess("Tipo de evidencia creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el tipo de evidencia."
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

      const primaryKey = confirmAction.row.eviPrimarykeyTiev;

      if (!primaryKey) {
        setError("El tipo de evidencia seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await evidenciasService.tipos.delete(primaryKey);
        setSuccess("Tipo de evidencia eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.eviEstadoregTiev === "1" ? "2" : "1";

        await evidenciasService.tipos.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado del tipo de evidencia actualizado correctamente.");
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
        title="Tipos de evidencia"
        subtitle="Administra el catálogo de tipos de evidencia usados para clasificar fotos, documentos, videos y soportes de obra."
        action={
          <Button
            variant="contained"
            startIcon={<CategoryIcon />}
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
          <Button variant="outlined" onClick={loadRows}>
            Actualizar
          </Button>
        }
      />

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin tipos de evidencia"
        emptyDescription="No hay tipos de evidencia registrados para mostrar."
        emptyActionLabel="Crear tipo"
        onEmptyAction={handleCreate}
        minWidth={850}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo registro interno</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map(row => (
              <TableRow key={row.eviPrimarykeyTiev ?? row.eviIdentifkeyTiev}>
                <TableCell>{row.eviIdentifkeyTiev}</TableCell>
                <TableCell>{row.eviDescripcionTiev}</TableCell>
                <TableCell>{row.eviTiporegistTiev}</TableCell>
                <TableCell>
                  <StatusChip value={row.eviEstadoregTiev} />
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

      <TipoEvidenciaForm
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
            ? "Eliminar tipo de evidencia"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este tipo de evidencia?"
            : "¿Confirmas que deseas cambiar el estado de este tipo de evidencia?"
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