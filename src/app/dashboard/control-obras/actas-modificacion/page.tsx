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
import Link from "next/link";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { EmptyState } from "../../../../components/common/EmptyState";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import {
  ActaModificacionForm,
  ActaModificacionFormValues
} from "../../../../components/control-obras/ActaModificacionForm";

type ConfirmAction =
  | { type: "delete"; row: ActaModificacionFormValues }
  | { type: "status"; row: ActaModificacionFormValues }
  | null;

export default function ActasModificacionPage() {
  const [rows, setRows] = useState<ActaModificacionFormValues[]>([]);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ActaModificacionFormValues | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.actaKey,
        row.ordenKey,
        row.fechaActa,
        row.causal,
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

  const handleEdit = (row: ActaModificacionFormValues) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: ActaModificacionFormValues) => {
    setSaving(true);

    if (selectedRow) {
      setRows(prev =>
        prev.map(row => (row.actaKey === selectedRow.actaKey ? data : row))
      );
      setSuccess("Acta actualizada en la vista. Pendiente conexión backend.");
    } else {
      setRows(prev => [...prev, data]);
      setSuccess("Acta creada en la vista. Pendiente conexión backend.");
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
        prev.filter(row => row.actaKey !== confirmAction.row.actaKey)
      );
      setSuccess("Acta eliminada de la vista. Pendiente conexión backend.");
    }

    if (confirmAction.type === "status") {
      setRows(prev =>
        prev.map(row =>
          row.actaKey === confirmAction.row.actaKey
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
        title="Actas de modificación"
        subtitle="Gestión de actas asociadas a modificaciones de órdenes de servicio."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear acta
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 2 }}>
        Esta pantalla está preparada en frontend. Falta confirmar endpoints de
        actas en el backend actualizado.
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
            label="Buscar acta"
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
              title="Sin actas"
              description="No hay actas de modificación registradas en la vista."
              actionLabel="Crear acta"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código acta</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Causal</TableCell>
                  <TableCell>Valor adición</TableCell>
                  <TableCell>Valor reducción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.actaKey}>
                    <TableCell>{row.actaKey}</TableCell>
                    <TableCell>{row.ordenKey}</TableCell>
                    <TableCell>{row.fechaActa}</TableCell>
                    <TableCell>{row.causal}</TableCell>
                    <TableCell>{row.valorAdicion}</TableCell>
                    <TableCell>{row.valorReduccion}</TableCell>
                    <TableCell>
                      <StatusChip value={row.estado} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        component={Link}
                        href={`/dashboard/control-obras/actas-modificacion/${row.actaKey}`}
                      >
                        Ver
                      </Button>

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

      <ActaModificacionForm
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
            ? "Eliminar acta"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta acta de la vista?"
            : "¿Confirmas que deseas cambiar el estado de esta acta?"
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