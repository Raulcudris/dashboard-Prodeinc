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
import { TipoEquipoForm } from "../../../../components/equipos/TipoEquipoForm";
import { equiposService } from "../../../../services/equipos.service";
import { TipoEquipoDto } from "../../../../types/equipos.types";

type ConfirmAction =
  | { type: "delete"; row: TipoEquipoDto }
  | { type: "status"; row: TipoEquipoDto }
  | null;

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

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.prvTipoequipoTieq,
        row.prvIdentifkeyUnme,
        row.prvDescripcionTieq,
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

      const response = await equiposService.tipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
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
    setSelectedRow(null);
    setOpenForm(true);
  };

  const handleEdit = (row: TipoEquipoDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: TipoEquipoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyTieq) {
        await equiposService.tipos.update(selectedRow.prvPrimarykeyTieq, data);
        setSuccess("Tipo de equipo actualizado correctamente.");
      } else {
        await equiposService.tipos.create(data);
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
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await equiposService.tipos.delete(primaryKey);
        setSuccess("Tipo de equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.prvEstadoregTieq === "1" ? "2" : "1";

        await equiposService.tipos.changeStatus(primaryKey, nextStatus);
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
    <Box>
      <PageHeader
        title="Tipos de equipo"
        subtitle="Clasificación de maquinaria, vehículos, herramientas y equipos."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
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

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin tipos de equipo"
              description="No hay tipos de equipo registrados."
              actionLabel="Crear tipo"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código tipo</TableCell>
                  <TableCell>Unidad</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Tipo registro</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow
                    key={row.prvPrimarykeyTieq ?? row.prvTipoequipoTieq}
                  >
                    <TableCell>{row.prvTipoequipoTieq}</TableCell>
                    <TableCell>{row.prvIdentifkeyUnme}</TableCell>
                    <TableCell>{row.prvDescripcionTieq}</TableCell>
                    <TableCell>{row.prvTiporegistTieq}</TableCell>
                    <TableCell>
                      <StatusChip value={row.prvEstadoregTieq} />
                    </TableCell>
                    <TableCell align="right">
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

      <TipoEquipoForm
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
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}