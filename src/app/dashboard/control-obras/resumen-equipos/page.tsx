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
import SummarizeIcon from "@mui/icons-material/Summarize";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { ResumenEquipoForm } from "../../../../components/control-obras/ResumenEquipoForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { ResumenEquipoDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ResumenEquipoDto }
  | { type: "status"; row: ResumenEquipoDto }
  | null;

function buildRowKey(row: ResumenEquipoDto, index: number) {
  return (
    row.orsPrimarykeyRseq ??
    row.orsIdentifkeyRseq ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${row.prvIdentifkeyInve ?? "INVE"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

export default function ResumenEquiposPage() {
  const [rows, setRows] = useState<ResumenEquipoDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ResumenEquipoDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyRseq,
        row.orsIdentifkeyOrde,
        row.prvIdentifkeyInve,
        row.orsCantidadRseq,
        row.orsValorunidadRseq,
        row.orsValortotalRseq,
        row.orsEstadoregRseq
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.resumenEquipos.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar el resumen de equipos."
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

  const handleEdit = (row: ResumenEquipoDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ResumenEquipoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyRseq) {
        await controlObrasService.resumenEquipos.update(
          selectedRow.orsPrimarykeyRseq,
          data
        );

        setSuccess("Resumen de equipo actualizado correctamente.");
      } else {
        await controlObrasService.resumenEquipos.create(data);
        setSuccess("Resumen de equipo creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el resumen de equipo."
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

      const primaryKey = confirmAction.row.orsPrimarykeyRseq;

      if (!primaryKey) {
        setError("El resumen seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.resumenEquipos.delete(primaryKey);
        setSuccess("Resumen de equipo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregRseq === "1" ? "2" : "1";

        await controlObrasService.resumenEquipos.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del resumen actualizado correctamente.");
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
        title="Resumen de equipos"
        subtitle="Administra la relación entre órdenes de servicio, equipos, cantidades y valores proyectados."
        action={
          <Button
            variant="contained"
            startIcon={<SummarizeIcon />}
            onClick={handleCreate}
          >
            Crear resumen
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
            label="Buscar resumen"
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
        emptyTitle="Sin resumen de equipos"
        emptyDescription="No hay resumen de equipos registrado para mostrar."
        emptyActionLabel="Crear resumen"
        onEmptyAction={handleCreate}
        minWidth={1050}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código resumen</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Equipo / inventario</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Valor unidad</TableCell>
              <TableCell>Valor total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyRseq}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.prvIdentifkeyInve}</TableCell>
                <TableCell>{row.orsCantidadRseq ?? 0}</TableCell>
                <TableCell>{formatCurrency(row.orsValorunidadRseq)}</TableCell>
                <TableCell>{formatCurrency(row.orsValortotalRseq)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregRseq} />
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

      <ResumenEquipoForm
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
            ? "Eliminar resumen de equipo"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este resumen de equipo?"
            : "¿Confirmas que deseas cambiar el estado de este resumen?"
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