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
import { DetalleEquipoOperacionForm } from "../../../../components/control-obras/DetalleEquipoOperacionForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { DetalleEquipoOperacionDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: DetalleEquipoOperacionDto }
  | { type: "status"; row: DetalleEquipoOperacionDto }
  | null;

export default function DetallesEquiposOperacionPage() {
  const [rows, setRows] = useState<DetalleEquipoOperacionDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<DetalleEquipoOperacionDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyDeop,
        row.orsIdentifkeyRope,
        row.orsIdentifkeyOrde,
        row.prvIdentifkeyInve,
        row.orsEstadoregDeop
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await controlObrasService.detallesEquiposOperacion.getPages({
          currentPage: 1,
          pageSize: 50,
          parameter: "TEXT",
          filter: ""
        });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los detalles de equipos."
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

  const handleEdit = (row: DetalleEquipoOperacionDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: DetalleEquipoOperacionDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyDeop) {
        await controlObrasService.detallesEquiposOperacion.update(
          selectedRow.orsPrimarykeyDeop,
          data
        );
        setSuccess("Detalle de equipo actualizado correctamente.");
      } else {
        await controlObrasService.detallesEquiposOperacion.create(data);
        setSuccess("Detalle de equipo creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el detalle de equipo."
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

      const primaryKey = confirmAction.row.orsPrimarykeyDeop;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.detallesEquiposOperacion.delete(primaryKey);
        setSuccess("Detalle de equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregDeop === "1" ? "2" : "1";

        await controlObrasService.detallesEquiposOperacion.changeStatus(
          primaryKey,
          nextStatus
        );
        setSuccess("Estado del detalle actualizado correctamente.");
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
        title="Detalle equipo operación"
        subtitle="Registro de equipos asociados a reportes de operación."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Crear detalle
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
            label="Buscar detalle"
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
              title="Sin detalles de operación"
              description="No hay detalles de equipos registrados."
              actionLabel="Crear detalle"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código detalle</TableCell>
                  <TableCell>Reporte operación</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow
                    key={row.orsPrimarykeyDeop ?? row.orsIdentifkeyDeop}
                  >
                    <TableCell>{row.orsIdentifkeyDeop}</TableCell>
                    <TableCell>{row.orsIdentifkeyRope}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>
                      <StatusChip value={row.orsEstadoregDeop} />
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

      <DetalleEquipoOperacionForm
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
            ? "Eliminar detalle de equipo"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este detalle de equipo?"
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