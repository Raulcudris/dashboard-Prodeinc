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
import InventoryIcon from "@mui/icons-material/Inventory";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { EquipoForm } from "../../../../components/equipos/EquipoForm";
import { equiposMaquinariaService } from "../../../../services/equipos.service";
import { EquipoDto } from "../../../../types/equipos.types";

type ConfirmAction =
  | { type: "delete"; row: EquipoDto }
  | { type: "status"; row: EquipoDto }
  | { type: "disponible"; row: EquipoDto }
  | null;

export default function EquiposPage() {
  const [rows, setRows] = useState<EquipoDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EquipoDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.prvIdentifkeyInve,
        row.prvIdentifkeyMprv,
        row.prvTipoequipoTieq,
        row.prvNombrequipoInve,
        row.prvRefermodeloInve,
        row.prvEquipoestadoInve,
        row.prvEquipoactivoInve,
        row.prvEstadoregInve,
        row.prvDescripcionInve
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await equiposMaquinariaService.equipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el inventario de equipos."
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

  const handleEdit = (row: EquipoDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: EquipoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyInve) {
        await equiposMaquinariaService.equipos.update(
          selectedRow.prvPrimarykeyInve,
          data
        );

        setSuccess("Equipo actualizado correctamente.");
      } else {
        await equiposMaquinariaService.equipos.create(data);
        setSuccess("Equipo creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el equipo."
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

      const primaryKey = confirmAction.row.prvPrimarykeyInve;

      if (!primaryKey) {
        setError("El equipo seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposMaquinariaService.equipos.delete(primaryKey);
        setSuccess("Equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.prvEstadoregInve === "1" ? "2" : "1";

        await equiposMaquinariaService.equipos.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del equipo actualizado correctamente.");
      }

      if (confirmAction.type === "disponible") {
        const nextDisponible =
          confirmAction.row.prvEquipoactivoInve === "1" ? "2" : "1";

        await equiposMaquinariaService.equipos.changeDisponible(
          primaryKey,
          nextDisponible
        );

        setSuccess("Disponibilidad del equipo actualizada correctamente.");
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
        title="Inventario de equipos"
        subtitle="Administra maquinaria amarilla, vehículos, herramientas y equipos disponibles para la operación de obra."
        action={
          <Button
            variant="contained"
            startIcon={<InventoryIcon />}
            onClick={handleCreate}
          >
            Crear equipo
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
            label="Buscar equipo"
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
        emptyTitle="Sin equipos"
        emptyDescription="No hay equipos registrados para mostrar."
        emptyActionLabel="Crear equipo"
        onEmptyAction={handleCreate}
        minWidth={1250}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código equipo</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Tipo equipo</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Referencia / modelo</TableCell>
              <TableCell>Estado operativo</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell>Estado registro</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map(row => (
              <TableRow key={row.prvPrimarykeyInve ?? row.prvIdentifkeyInve}>
                <TableCell>{row.prvIdentifkeyInve}</TableCell>
                <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                <TableCell>{row.prvTipoequipoTieq}</TableCell>
                <TableCell>{row.prvNombrequipoInve}</TableCell>
                <TableCell>{row.prvRefermodeloInve}</TableCell>
                <TableCell>{row.prvEquipoestadoInve}</TableCell>
                <TableCell>
                  <StatusChip value={row.prvEquipoactivoInve} />
                </TableCell>
                <TableCell>
                  <StatusChip value={row.prvEstadoregInve} />
                </TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 280,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.prvDescripcionInve}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <CrudActionButtons
                    disabled={saving}
                    onEdit={() => handleEdit(row)}
                    statusLabel="Estado"
                    onChangeStatus={() =>
                      setConfirmAction({ type: "status", row })
                    }
                    onDelete={() => setConfirmAction({ type: "delete", row })}
                  />

                  <Button
                    size="small"
                    disabled={saving}
                    onClick={() => setConfirmAction({ type: "disponible", row })}
                    sx={{ ml: 0.5 }}
                  >
                    Disponible
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrudTableCard>

      <EquipoForm
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
            ? "Eliminar equipo"
            : confirmAction?.type === "disponible"
              ? "Cambiar disponibilidad"
              : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este equipo?"
            : confirmAction?.type === "disponible"
              ? "¿Confirmas que deseas cambiar la disponibilidad de este equipo?"
              : "¿Confirmas que deseas cambiar el estado de este equipo?"
        }
        confirmText={
          confirmAction?.type === "delete"
            ? "Eliminar"
            : confirmAction?.type === "disponible"
              ? "Cambiar disponibilidad"
              : "Cambiar estado"
        }
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}