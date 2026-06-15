"use client";

import { useMemo, useState } from "react";
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
import { EmptyState } from "../../../../components/common/EmptyState";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import {
  ActaModificacionDetalleForm,
  ActaModificacionDetalleFormValues
} from "../../../../components/control-obras/ActaModificacionDetalleForm";

type ConfirmAction =
  | { type: "delete"; row: ActaModificacionDetalleFormValues }
  | { type: "status"; row: ActaModificacionDetalleFormValues }
  | null;

export default function ActasModificacionDetallesPage() {
  const [rows, setRows] = useState<ActaModificacionDetalleFormValues[]>([]);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ActaModificacionDetalleFormValues | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.detalleKey,
        row.actaKey,
        row.tipoEquipoKey,
        row.descripcion,
        row.estado
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenForm(true);
  };

  const handleEdit = (row: ActaModificacionDetalleFormValues) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: ActaModificacionDetalleFormValues) => {
    setSaving(true);

    if (selectedRow) {
      setRows(prev =>
        prev.map(row =>
          row.detalleKey === selectedRow.detalleKey ? data : row
        )
      );
      setSuccess("Detalle actualizado en la vista. Pendiente conexión backend.");
    } else {
      setRows(prev => [...prev, data]);
      setSuccess("Detalle creado en la vista. Pendiente conexión backend.");
    }

    setOpenForm(false);
    setSelectedRow(null);
    setSaving(false);
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;

    setSaving(true);

    if (confirmAction.type === "delete") {
      setRows(prev =>
        prev.filter(row => row.detalleKey !== confirmAction.row.detalleKey)
      );
      setSuccess("Detalle eliminado de la vista. Pendiente conexión backend.");
    }

    if (confirmAction.type === "status") {
      setRows(prev =>
        prev.map(row =>
          row.detalleKey === confirmAction.row.detalleKey
            ? {
                ...row,
                estado: row.estado === "1" ? "2" : "1"
              }
            : row
        )
      );
      setSuccess("Estado cambiado en la vista. Pendiente conexión backend.");
    }

    setConfirmAction(null);
    setSaving(false);
  };

  return (
    <Box>
      <PageHeader
        title="Detalle actas"
        subtitle="Detalle de equipos, cantidades y valores asociados a actas de modificación."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear detalle
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        Esta pantalla está preparada en frontend. Falta confirmar endpoints de
        detalles de actas en el backend actualizado.
      </Alert>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar detalle"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={
          <Button variant="outlined" onClick={() => setRows([...rows])}>
            Actualizar
          </Button>
        }
      />

      <Card>
        <CardContent>
          {filteredRows.length === 0 ? (
            <EmptyState
              title="Sin detalles"
              description="No hay detalles de actas registrados en la vista."
              actionLabel="Crear detalle"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código detalle</TableCell>
                  <TableCell>Acta</TableCell>
                  <TableCell>Tipo equipo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor unitario</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.detalleKey}>
                    <TableCell>{row.detalleKey}</TableCell>
                    <TableCell>{row.actaKey}</TableCell>
                    <TableCell>{row.tipoEquipoKey}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell>{row.cantidad}</TableCell>
                    <TableCell>{row.valorUnitario}</TableCell>
                    <TableCell>{row.valorTotal}</TableCell>
                    <TableCell>
                      <StatusChip value={row.estado} />
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

      <ActaModificacionDetalleForm
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
            ? "Eliminar detalle"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este detalle de la vista?"
            : "¿Confirmas que deseas cambiar el estado de este detalle?"
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