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
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { ActaModificacionForm } from "../../../../components/control-obras/ActaModificacionForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { ActaModificacionDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ActaModificacionDto }
  | { type: "status"; row: ActaModificacionDto }
  | null;

function buildRowKey(row: ActaModificacionDto, index: number) {
  return (
    row.orsPrimarykeyAcmo ??
    row.orsIdentifkeyAcmo ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${row.orsNumeroactaAcmo ?? "ACTA"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

export default function ActasModificacionPage() {
  const router = useRouter();

  const [rows, setRows] = useState<ActaModificacionDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ActaModificacionDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyAcmo,
        row.orsIdentifkeyOrde,
        row.orsNumeroactaAcmo,
        row.orsFechaactaAcmo,
        row.orsTipoactaAcmo,
        row.orsConceptoAcmo,
        row.orsDescripcionAcmo,
        row.orsJustificacionAcmo,
        row.orsValoractualAcmo,
        row.orsValormodificadoAcmo,
        row.orsValortotalAcmo,
        row.orsEstadoregAcmo
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.actasModificacion.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las actas de modificación."
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

  const handleEdit = (row: ActaModificacionDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: ActaModificacionDto) => {
    if (!row.orsIdentifkeyAcmo) return;

    router.push(
      `/dashboard/control-obras/actas-modificacion/${row.orsIdentifkeyAcmo}`
    );
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ActaModificacionDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyAcmo) {
        await controlObrasService.actasModificacion.update(
          selectedRow.orsPrimarykeyAcmo,
          data
        );

        setSuccess("Acta de modificación actualizada correctamente.");
      } else {
        await controlObrasService.actasModificacion.create(data);
        setSuccess("Acta de modificación creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el acta de modificación."
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

      const primaryKey = confirmAction.row.orsPrimarykeyAcmo;

      if (!primaryKey) {
        setError("El acta seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.actasModificacion.delete(primaryKey);
        setSuccess("Acta de modificación eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregAcmo === "1" ? "2" : "1";

        await controlObrasService.actasModificacion.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del acta actualizado correctamente.");
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
        title="Actas de modificación"
        subtitle="Administra cambios de cantidades, valores, fechas y condiciones contractuales asociadas a la obra."
        action={
          <Button
            variant="contained"
            startIcon={<DescriptionIcon />}
            onClick={handleCreate}
          >
            Crear acta
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
            label="Buscar acta"
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
        emptyTitle="Sin actas de modificación"
        emptyDescription="No hay actas de modificación registradas para mostrar."
        emptyActionLabel="Crear acta"
        onEmptyAction={handleCreate}
        minWidth={1500}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código acta</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Número acta</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Concepto</TableCell>
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
                <TableCell>{row.orsIdentifkeyAcmo}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsNumeroactaAcmo}</TableCell>
                <TableCell>{row.orsFechaactaAcmo}</TableCell>
                <TableCell>{row.orsTipoactaAcmo}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 360,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.orsConceptoAcmo}
                  </Box>
                </TableCell>
                <TableCell>{formatCurrency(row.orsValoractualAcmo)}</TableCell>
                <TableCell>
                  {formatCurrency(row.orsValormodificadoAcmo)}
                </TableCell>
                <TableCell>{formatCurrency(row.orsValortotalAcmo)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregAcmo} />
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
                      disabled={!row.orsIdentifkeyAcmo}
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

      <ActaModificacionForm
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
            ? "Eliminar acta de modificación"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta acta de modificación?"
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