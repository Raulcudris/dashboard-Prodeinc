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
import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { LoadingBox } from "../../../components/common/LoadingBox";
import { EmptyState } from "../../../components/common/EmptyState";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { PlanSemanalForm } from "../../../components/control-obras/PlanSemanalForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { PlanSemanalDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: PlanSemanalDto }
  | { type: "status"; row: PlanSemanalDto }
  | null;

export default function PlanesSemanalesPage() {
  const [rows, setRows] = useState<PlanSemanalDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PlanSemanalDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPltr,
        row.orsIdentifkeyPsem,
        row.orsEstadoregPlse
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.planesSemanales.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar los planes semanales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleSubmit = async (data: PlanSemanalDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPlse) {
        await controlObrasService.planesSemanales.update(
          selectedRow.orsPrimarykeyPlse,
          data
        );
        setSuccess("Plan semanal actualizado correctamente.");
      } else {
        await controlObrasService.planesSemanales.create(data);
        setSuccess("Plan semanal creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar el plan semanal.");
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

      const primaryKey = confirmAction.row.orsPrimarykeyPlse;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.planesSemanales.delete(primaryKey);
        setSuccess("Plan semanal eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.orsEstadoregPlse === "1" ? "2" : "1";
        await controlObrasService.planesSemanales.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado actualizado correctamente.");
      }

      setConfirmAction(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible ejecutar la acción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Plan semanal"
        subtitle="Programación semanal de cantidades, valores y actividades a ejecutar."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setOpenForm(true);
            }}
          >
            Crear plan semanal
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={<Button variant="outlined" onClick={loadRows}>Actualizar</Button>}
      />

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin planes semanales"
              description="No hay planes semanales registrados."
              actionLabel="Crear plan semanal"
              onAction={() => setOpenForm(true)}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Proyección</TableCell>
                  <TableCell>Cant. programada</TableCell>
                  <TableCell>Cant. ejecutada</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Valor ejecutado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.orsPrimarykeyPlse ?? row.orsIdentifkeyPlse}>
                    <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                    <TableCell>{row.orsCantidunidadPlse}</TableCell>
                    <TableCell>{row.orsEjecutunidadPlse}</TableCell>
                    <TableCell>{row.orsValortotalPlse}</TableCell>
                    <TableCell>{row.orsValorejecutPlse}</TableCell>
                    <TableCell><StatusChip value={row.orsEstadoregPlse} /></TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => { setSelectedRow(row); setOpenForm(true); }}>
                        Editar
                      </Button>
                      <Button size="small" onClick={() => setConfirmAction({ type: "status", row })}>
                        Estado
                      </Button>
                      <Button size="small" color="error" onClick={() => setConfirmAction({ type: "delete", row })}>
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

      <PlanSemanalForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar plan semanal" : "Cambiar estado"}
        message={confirmAction?.type === "delete" ? "¿Confirmas que deseas eliminar este plan semanal?" : "¿Confirmas que deseas cambiar el estado?"}
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}