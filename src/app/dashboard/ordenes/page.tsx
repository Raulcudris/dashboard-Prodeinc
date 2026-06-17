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
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { OrdenServicioForm } from "../../../components/control-obras/OrdenServicioForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { OrdenServicioDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: OrdenServicioDto }
  | { type: "status"; row: OrdenServicioDto }
  | null;

function buildRowKey(row: OrdenServicioDto, index: number) {
  return (
    row.orsPrimarykeyOrde ??
    row.orsIdentifkeyOrde ??
    `${row.orsCodservicioSebs ?? "ORDE"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

export default function OrdenesServicioPage() {
  const router = useRouter();

  const [rows, setRows] = useState<OrdenServicioDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrdenServicioDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyOrde,
        row.orsCodservicioSebs,
        row.orsServiceventOrde,
        row.orsServiclugarOrde,
        row.orsServicobjetoOrde,
        row.prvIdentifkeyMprv,
        row.prvIdentifkeyRelg,
        row.orsTiporegistOrde,
        row.orsEstadoregOrde
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.ordenes.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las órdenes de servicio."
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

  const handleEdit = (row: OrdenServicioDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: OrdenServicioDto) => {
    if (!row.orsIdentifkeyOrde) return;

    router.push(`/dashboard/ordenes/${row.orsIdentifkeyOrde}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: OrdenServicioDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyOrde) {
        await controlObrasService.ordenes.update(
          selectedRow.orsPrimarykeyOrde,
          data
        );

        setSuccess("Orden de servicio actualizada correctamente.");
      } else {
        await controlObrasService.ordenes.create(data);
        setSuccess("Orden de servicio creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la orden de servicio."
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

      const primaryKey = confirmAction.row.orsPrimarykeyOrde;

      if (!primaryKey) {
        setError("La orden seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.ordenes.delete(primaryKey);
        setSuccess("Orden de servicio eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregOrde === "1" ? "2" : "1";

        await controlObrasService.ordenes.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado de la orden actualizado correctamente.");
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
        title="Órdenes de servicio"
        subtitle="Administra las órdenes base de obra civil, valores, fechas, proveedores, lugares y objetos contractuales."
        action={
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={handleCreate}
          >
            Crear orden
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
            label="Buscar orden"
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
        emptyTitle="Sin órdenes de servicio"
        emptyDescription="No hay órdenes de servicio registradas para mostrar."
        emptyActionLabel="Crear orden"
        onEmptyAction={handleCreate}
        minWidth={1520}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código orden</TableCell>
              <TableCell>Código servicio</TableCell>
              <TableCell>Fecha autorización</TableCell>
              <TableCell>Evento / servicio</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Objeto</TableCell>
              <TableCell>Inicio plan</TableCell>
              <TableCell>Fin plan</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Valor base</TableCell>
              <TableCell>IVA</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsCodservicioSebs}</TableCell>
                <TableCell>{row.orsAutorifechaOrde}</TableCell>
                <TableCell>{row.orsServiceventOrde}</TableCell>
                <TableCell>{row.orsServiclugarOrde}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 320,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.orsServicobjetoOrde}
                  </Box>
                </TableCell>
                <TableCell>{row.orsPlanfechiniOrde}</TableCell>
                <TableCell>{row.orsPlanfechfinOrde}</TableCell>
                <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                <TableCell>{formatCurrency(row.orsValorbaseOrde)}</TableCell>
                <TableCell>{formatCurrency(row.orsValordeivaOrde)}</TableCell>
                <TableCell>{formatCurrency(row.orsValortotalOrde)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregOrde} />
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
                      disabled={!row.orsIdentifkeyOrde}
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

      <OrdenServicioForm
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
            ? "Eliminar orden de servicio"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta orden de servicio?"
            : "¿Confirmas que deseas cambiar el estado de esta orden?"
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