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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { PlanSemanalForm } from "../../../components/control-obras/PlanSemanalForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { PlanSemanalDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: PlanSemanalDto }
  | { type: "status"; row: PlanSemanalDto }
  | null;

function buildRowKey(row: PlanSemanalDto, index: number) {
  return (
    row.orsPrimarykeyPlse ??
    row.orsIdentifkeyPlse ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${row.orsIdentifkeyPltr ?? "PLTR"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function PlanesSemanalesPage() {
  const router = useRouter();

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
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPltr,
        row.orsIdentifkeyPsem,
        row.orsCantidunidadPlse,
        row.orsValorunidadPlse,
        row.orsValortotalPlse,
        row.orsEjecutunidadPlse,
        row.orsValorejecutPlse,
        row.orsTiporegistPlse,
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

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los planes semanales."
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

  const handleEdit = (row: PlanSemanalDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: PlanSemanalDto) => {
    if (!row.orsIdentifkeyPlse) return;

    router.push(`/dashboard/planes-semanales/${row.orsIdentifkeyPlse}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

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
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el plan semanal."
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

      const primaryKey = confirmAction.row.orsPrimarykeyPlse;

      if (!primaryKey) {
        setError("El plan semanal seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.planesSemanales.delete(primaryKey);
        setSuccess("Plan semanal eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregPlse === "1" ? "2" : "1";

        await controlObrasService.planesSemanales.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del plan semanal actualizado correctamente.");
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
        title="Planes semanales"
        subtitle="Administra la programación semanal de ejecución por orden, plan de trabajo y proyección semanal."
        action={
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            onClick={handleCreate}
          >
            Crear plan semanal
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
            label="Buscar plan semanal"
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
        emptyTitle="Sin planes semanales"
        emptyDescription="No hay planes semanales registrados para mostrar."
        emptyActionLabel="Crear plan semanal"
        onEmptyAction={handleCreate}
        minWidth={1380}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código plan semanal</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Plan trabajo</TableCell>
              <TableCell>Proyección semanal</TableCell>
              <TableCell>Cantidad programada</TableCell>
              <TableCell>Valor unidad</TableCell>
              <TableCell>Valor total</TableCell>
              <TableCell>Cantidad ejecutada</TableCell>
              <TableCell>Valor ejecutado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                <TableCell>{formatNumber(row.orsCantidunidadPlse)}</TableCell>
                <TableCell>{formatCurrency(row.orsValorunidadPlse)}</TableCell>
                <TableCell>{formatCurrency(row.orsValortotalPlse)}</TableCell>
                <TableCell>{formatNumber(row.orsEjecutunidadPlse)}</TableCell>
                <TableCell>{formatCurrency(row.orsValorejecutPlse)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregPlse} />
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 0.5
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      disabled={!row.orsIdentifkeyPlse}
                      onClick={() => handleGoToDetail(row)}
                    >
                      Detalle
                    </Button>

                    <CrudActionButtons
                      disabled={saving}
                      onEdit={() => handleEdit(row)}
                      onChangeStatus={() =>
                        setConfirmAction({ type: "status", row })
                      }
                      onDelete={() =>
                        setConfirmAction({ type: "delete", row })
                      }
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrudTableCard>

      <PlanSemanalForm
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
            ? "Eliminar plan semanal"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este plan semanal?"
            : "¿Confirmas que deseas cambiar el estado de este plan semanal?"
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