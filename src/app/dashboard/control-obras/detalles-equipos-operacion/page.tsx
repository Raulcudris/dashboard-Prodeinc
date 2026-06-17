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
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { DetalleEquipoOperacionForm } from "../../../../components/control-obras/DetalleEquipoOperacionForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { DetalleEquipoOperacionDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: DetalleEquipoOperacionDto }
  | { type: "status"; row: DetalleEquipoOperacionDto }
  | null;

function buildRowKey(row: DetalleEquipoOperacionDto, index: number) {
  return (
    row.orsPrimarykeyDeop ??
    row.orsIdentifkeyDeop ??
    `${row.orsIdentifkeyRope ?? "ROPE"}-${row.prvIdentifkeyInve ?? "INVE"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function DetallesEquiposOperacionPage() {
  const router = useRouter();

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
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyDeop,
        row.orsIdentifkeyRope,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPsem,
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyPunt,
        row.prvIdentifkeyInve,
        row.prvTipoequipoTieq,
        row.orsNombrequipoDeop,
        row.orsRefermodeloDeop,
        row.orsNroregistroDeop,
        row.orsUnidadDeop,
        row.orsTipocontrolDeop,
        row.orsFechatrabajoDeop,
        row.orsObservacionDeop,
        row.orsTiporegistDeop,
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

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los detalles de equipos en operación."
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

  const handleGoToDetail = (row: DetalleEquipoOperacionDto) => {
    if (!row.orsIdentifkeyDeop) return;

    router.push(
      `/dashboard/control-obras/detalles-equipos-operacion/${row.orsIdentifkeyDeop}`
    );
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
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
          "No fue posible guardar el detalle de equipo en operación."
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
        setError("El detalle seleccionado no tiene llave primaria.");
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
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Detalles equipos operación"
        subtitle="Administra el control operativo de maquinaria, equipos, horómetros, kilometrajes, días trabajados y valores por reporte."
        action={
          <Button
            variant="contained"
            startIcon={<PrecisionManufacturingIcon />}
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

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin detalles de equipos"
        emptyDescription="No hay detalles de equipos en operación registrados para mostrar."
        emptyActionLabel="Crear detalle"
        onEmptyAction={handleCreate}
        minWidth={1700}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código detalle</TableCell>
              <TableCell>Reporte</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Proyección</TableCell>
              <TableCell>Plan semanal</TableCell>
              <TableCell>Sitio</TableCell>
              <TableCell>Equipo</TableCell>
              <TableCell>Tipo equipo</TableCell>
              <TableCell>Nombre equipo</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Registro</TableCell>
              <TableCell>Fecha trabajo</TableCell>
              <TableCell>Días</TableCell>
              <TableCell>Valor unidad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyDeop}</TableCell>
                <TableCell>{row.orsIdentifkeyRope}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                <TableCell>{row.prvIdentifkeyInve}</TableCell>
                <TableCell>{row.prvTipoequipoTieq}</TableCell>
                <TableCell>{row.orsNombrequipoDeop}</TableCell>
                <TableCell>{row.orsRefermodeloDeop}</TableCell>
                <TableCell>{row.orsNroregistroDeop}</TableCell>
                <TableCell>{row.orsFechatrabajoDeop}</TableCell>
                <TableCell>{formatNumber(row.orsDiatrabajadoDeop)}</TableCell>
                <TableCell>{formatCurrency(row.orsValorunidadDeop)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregDeop} />
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
                      disabled={!row.orsIdentifkeyDeop}
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

      <DetalleEquipoOperacionForm
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
            ? "Eliminar detalle de equipo"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este detalle de equipo en operación?"
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