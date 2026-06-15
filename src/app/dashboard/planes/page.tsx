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
import { PlanTrabajoForm } from "../../../components/control-obras/PlanTrabajoForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { PlanTrabajoDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: PlanTrabajoDto }
  | { type: "status"; row: PlanTrabajoDto }
  | null;

export default function PlanTrabajoProyectadoPage() {
  const [rows, setRows] = useState<PlanTrabajoDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PlanTrabajoDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyPltr,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPunt,
        row.orsDesactividadPltr,
        row.prvIdentifkeyInve,
        row.orsEstadoregPltr
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.planes.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar los planes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleSubmit = async (data: PlanTrabajoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPltr) {
        await controlObrasService.planes.update(selectedRow.orsPrimarykeyPltr, data);
        setSuccess("Plan actualizado correctamente.");
      } else {
        await controlObrasService.planes.create(data);
        setSuccess("Plan creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar el plan.");
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

      const primaryKey = confirmAction.row.orsPrimarykeyPltr;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.planes.delete(primaryKey);
        setSuccess("Plan eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.orsEstadoregPltr === "1" ? "2" : "1";
        await controlObrasService.planes.changeStatus(primaryKey, nextStatus);
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
        title="Plan de trabajo proyectado"
        subtitle="Planeación de actividades, cantidades, equipos, unidades y valores por orden y punto de trabajo."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setOpenForm(true);
            }}
          >
            Crear plan
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
              title="Sin planes"
              description="No hay planes de trabajo proyectados."
              actionLabel="Crear plan"
              onAction={() => setOpenForm(true)}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código plan</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Punto</TableCell>
                  <TableCell>Actividad</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Valor total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.orsPrimarykeyPltr ?? row.orsIdentifkeyPltr}>
                    <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                    <TableCell>{row.orsDesactividadPltr}</TableCell>
                    <TableCell>{row.prvIdentifkeyInve}</TableCell>
                    <TableCell>{row.orsCantidunidadRseq}</TableCell>
                    <TableCell>{row.orsValortotalRseq}</TableCell>
                    <TableCell><StatusChip value={row.orsEstadoregPltr} /></TableCell>
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

      <PlanTrabajoForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar plan" : "Cambiar estado"}
        message={confirmAction?.type === "delete" ? "¿Confirmas que deseas eliminar este plan?" : "¿Confirmas que deseas cambiar el estado?"}
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}