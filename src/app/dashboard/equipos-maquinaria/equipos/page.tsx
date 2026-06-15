"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { EquipoForm } from "../../../../components/equipos/EquipoForm";
import { equiposService } from "../../../../services/equipos.service";
import { EquipoDto } from "../../../../types/equipos.types";

type ConfirmAction =
  | { type: "delete"; row: EquipoDto }
  | { type: "status"; row: EquipoDto }
  | { type: "available"; row: EquipoDto }
  | null;

export default function InventarioEquiposPage() {
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
        row.prvEstadoregInve
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await equiposService.equipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los equipos."
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

  const handleSubmit = async (data: EquipoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyInve) {
        await equiposService.equipos.update(selectedRow.prvPrimarykeyInve, data);
        setSuccess("Equipo actualizado correctamente.");
      } else {
        await equiposService.equipos.create(data);
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

      const row = confirmAction.row;
      const primaryKey = row.prvPrimarykeyInve;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposService.equipos.delete(primaryKey);
        setSuccess("Equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = row.prvEstadoregInve === "1" ? "2" : "1";
        await equiposService.equipos.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado del equipo actualizado correctamente.");
      }

      if (confirmAction.type === "available") {
        const nextAvailable = row.prvEquipoactivoInve === "1" ? "2" : "1";
        await equiposService.equipos.changeDisponible(
          primaryKey,
          nextAvailable
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
    <Box>
      <PageHeader
        title="Inventario de equipos"
        subtitle="Control de maquinaria, vehículos, herramientas y disponibilidad operativa."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
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

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin equipos"
              description="No hay equipos o maquinaria registrados."
              actionLabel="Crear equipo"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código equipo</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Estado operativo</TableCell>
                  <TableCell>Disponible</TableCell>
                  <TableCell>Estado registro</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow
                    key={row.prvPrimarykeyInve ?? row.prvIdentifkeyInve}
                  >
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                    <TableCell>{row.prvTipoequipoTieq}</TableCell>
                    <TableCell>{row.prvNombrequipoInve}</TableCell>
                    <TableCell>{row.prvRefermodeloInve}</TableCell>
                    <TableCell>{row.prvEquipoestadoInve}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          row.prvEquipoactivoInve === "1"
                            ? "Disponible"
                            : "No disponible"
                        }
                        color={
                          row.prvEquipoactivoInve === "1"
                            ? "success"
                            : "default"
                        }
                        variant={
                          row.prvEquipoactivoInve === "1"
                            ? "filled"
                            : "outlined"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <StatusChip value={row.prvEstadoregInve} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(row)}>
                        Editar
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          setConfirmAction({ type: "available", row })
                        }
                      >
                        Disponible
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

      <EquipoForm
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
            ? "Eliminar equipo"
            : confirmAction?.type === "available"
              ? "Cambiar disponibilidad"
              : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este equipo?"
            : confirmAction?.type === "available"
              ? "¿Confirmas que deseas cambiar la disponibilidad de este equipo?"
              : "¿Confirmas que deseas cambiar el estado de este equipo?"
        }
        confirmText={
          confirmAction?.type === "delete"
            ? "Eliminar"
            : confirmAction?.type === "available"
              ? "Cambiar disponibilidad"
              : "Cambiar estado"
        }
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}