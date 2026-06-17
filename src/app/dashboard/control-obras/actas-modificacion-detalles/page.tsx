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
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { ActaModificacionDetalleForm } from "../../../../components/control-obras/ActaModificacionDetalleForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { ActaModificacionDetalleDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ActaModificacionDetalleDto }
  | { type: "status"; row: ActaModificacionDetalleDto }
  | null;

function buildRowKey(row: ActaModificacionDetalleDto, index: number) {
  return (
    row.orsPrimarykeyAcdt ??
    row.orsIdentifkeyAcdt ??
    `${row.orsIdentifkeyAcmo ?? "ACMO"}-${row.orsIdentifkeyOrde ?? "ORDE"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function ActasModificacionDetallesPage() {
  const router = useRouter();

  const [rows, setRows] = useState<ActaModificacionDetalleDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ActaModificacionDetalleDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyAcdt,
        row.orsIdentifkeyAcmo,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPltr,
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyPunt,
        row.orsDescripcionAcdt,
        row.orsUnidadAcdt,
        row.orsObservacionAcdt,
        row.orsTiporegistAcdt,
        row.orsEstadoregAcdt
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
        await controlObrasService.actasModificacionDetalles.getPages({
          currentPage: 1,
          pageSize: 50,
          parameter: "TEXT",
          filter: ""
        });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los detalles de actas de modificación."
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

  const handleEdit = (row: ActaModificacionDetalleDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: ActaModificacionDetalleDto) => {
    if (!row.orsIdentifkeyAcdt) return;

    router.push(
      `/dashboard/control-obras/actas-modificacion-detalles/${row.orsIdentifkeyAcdt}`
    );
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ActaModificacionDetalleDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyAcdt) {
        await controlObrasService.actasModificacionDetalles.update(
          selectedRow.orsPrimarykeyAcdt,
          data
        );

        setSuccess("Detalle de acta actualizado correctamente.");
      } else {
        await controlObrasService.actasModificacionDetalles.create(data);
        setSuccess("Detalle de acta creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el detalle de acta."
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

      const primaryKey = confirmAction.row.orsPrimarykeyAcdt;

      if (!primaryKey) {
        setError("El detalle seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.actasModificacionDetalles.delete(primaryKey);
        setSuccess("Detalle de acta eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregAcdt === "1" ? "2" : "1";

        await controlObrasService.actasModificacionDetalles.changeStatus(
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
        title="Detalles de actas de modificación"
        subtitle="Administra los ítems modificados por acta: cantidades, unidades, valores y planes afectados."
        action={
          <Button
            variant="contained"
            startIcon={<PlaylistAddCheckIcon />}
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
        emptyTitle="Sin detalles de actas"
        emptyDescription="No hay detalles de actas de modificación registrados para mostrar."
        emptyActionLabel="Crear detalle"
        onEmptyAction={handleCreate}
        minWidth={1550}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código detalle</TableCell>
              <TableCell>Acta</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Sitio</TableCell>
              <TableCell>Plan trabajo</TableCell>
              <TableCell>Plan semanal</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Cant. actual</TableCell>
              <TableCell>Cant. modificada</TableCell>
              <TableCell>Valor unidad</TableCell>
              <TableCell>Valor actual</TableCell>
              <TableCell>Valor modificado</TableCell>
              <TableCell>Valor total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyAcdt}</TableCell>
                <TableCell>{row.orsIdentifkeyAcmo}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.orsDescripcionAcdt}
                  </Box>
                </TableCell>
                <TableCell>{row.orsUnidadAcdt}</TableCell>
                <TableCell>
                  {formatNumber(row.orsCantidadactualAcdt)}
                </TableCell>
                <TableCell>
                  {formatNumber(row.orsCantidadmodificadaAcdt)}
                </TableCell>
                <TableCell>
                  {formatCurrency(row.orsValorunidadAcdt)}
                </TableCell>
                <TableCell>
                  {formatCurrency(row.orsValoractualAcdt)}
                </TableCell>
                <TableCell>
                  {formatCurrency(row.orsValormodificadoAcdt)}
                </TableCell>
                <TableCell>
                  {formatCurrency(row.orsValortotalAcdt)}
                </TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregAcdt} />
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
                      disabled={!row.orsIdentifkeyAcdt}
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

      <ActaModificacionDetalleForm
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
            ? "Eliminar detalle de acta"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este detalle de acta?"
            : "¿Confirmas que deseas cambiar el estado de este detalle de acta?"
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