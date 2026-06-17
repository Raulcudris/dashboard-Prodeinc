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
import { ReporteDiarioForm } from "../../../components/control-obras/ReporteDiarioForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { ReporteDiarioDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ReporteDiarioDto }
  | { type: "status"; row: ReporteDiarioDto }
  | null;

function buildRowKey(row: ReporteDiarioDto, index: number) {
  return (
    row.orsPrimarykeyPdia ??
    row.orsIdentifkeyPdia ??
    `${row.orsIdentifkeyOrde ?? "PDIA"}-${index}`
  );
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function ReportesDiariosPage() {
  const router = useRouter();

  const [rows, setRows] = useState<ReporteDiarioDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReporteDiarioDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyPdia,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPlse,
        row.orsIdentifkeyPsem,
        row.orsFechareportPdia,
        row.orsObservacionPdia,
        row.orsTiporegistPdia,
        row.orsEstadoregPdia
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.reportesDiarios.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los reportes diarios."
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

  const handleEdit = (row: ReporteDiarioDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: ReporteDiarioDto) => {
    if (!row.orsIdentifkeyPdia) return;

    router.push(`/dashboard/reportes/${row.orsIdentifkeyPdia}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ReporteDiarioDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPdia) {
        await controlObrasService.reportesDiarios.update(
          selectedRow.orsPrimarykeyPdia,
          data
        );

        setSuccess("Reporte diario actualizado correctamente.");
      } else {
        await controlObrasService.reportesDiarios.create(data);
        setSuccess("Reporte diario creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el reporte diario."
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

      const primaryKey = confirmAction.row.orsPrimarykeyPdia;

      if (!primaryKey) {
        setError("El reporte seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.reportesDiarios.delete(primaryKey);
        setSuccess("Reporte diario eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregPdia === "1" ? "2" : "1";

        await controlObrasService.reportesDiarios.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del reporte actualizado correctamente.");
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
        title="Reportes diarios"
        subtitle="Registra y consulta los avances diarios de obra asociados a planes semanales, órdenes de servicio y proyecciones."
        action={
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={handleCreate}
          >
            Crear reporte
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
            label="Buscar reporte"
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
        emptyTitle="Sin reportes diarios"
        emptyDescription="No hay reportes diarios registrados para mostrar."
        emptyActionLabel="Crear reporte"
        onEmptyAction={handleCreate}
        minWidth={1250}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código reporte</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Plan semanal</TableCell>
              <TableCell>Proyección semanal</TableCell>
              <TableCell>Fecha reporte</TableCell>
              <TableCell>Cantidad ejecutada</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Tipo registro</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyPdia}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                <TableCell>{row.orsFechareportPdia}</TableCell>
                <TableCell>{formatNumber(row.orsEjecutunidadPdia)}</TableCell>
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
                    {row.orsObservacionPdia}
                  </Box>
                </TableCell>
                <TableCell>{row.orsTiporegistPdia}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregPdia} />
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
                      disabled={!row.orsIdentifkeyPdia}
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

      <ReporteDiarioForm
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
            ? "Eliminar reporte diario"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este reporte diario?"
            : "¿Confirmas que deseas cambiar el estado de este reporte diario?"
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