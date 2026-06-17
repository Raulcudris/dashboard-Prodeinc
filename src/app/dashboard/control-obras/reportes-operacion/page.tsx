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
import EngineeringIcon from "@mui/icons-material/Engineering";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { ReporteOperacionForm } from "../../../../components/control-obras/ReporteOperacionForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { ReporteOperacionDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ReporteOperacionDto }
  | { type: "status"; row: ReporteOperacionDto }
  | null;

function buildRowKey(row: ReporteOperacionDto, index: number) {
  return (
    row.orsPrimarykeyRope ??
    row.orsIdentifkeyRope ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${index}`
  );
}

export default function ReportesOperacionPage() {
  const router = useRouter();

  const [rows, setRows] = useState<ReporteOperacionDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ReporteOperacionDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyRope,
        row.orsIdentifkeyOrde,
        row.orsFechareportRope,
        row.orsObservacionRope,
        row.orsTiporegistRope,
        row.orsEstadoregRope
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.reportesOperacion.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los reportes de operación."
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

  const handleEdit = (row: ReporteOperacionDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: ReporteOperacionDto) => {
    if (!row.orsIdentifkeyRope) return;

    router.push(
      `/dashboard/control-obras/reportes-operacion/${row.orsIdentifkeyRope}`
    );
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ReporteOperacionDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyRope) {
        await controlObrasService.reportesOperacion.update(
          selectedRow.orsPrimarykeyRope,
          data
        );

        setSuccess("Reporte de operación actualizado correctamente.");
      } else {
        await controlObrasService.reportesOperacion.create(data);
        setSuccess("Reporte de operación creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el reporte de operación."
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

      const primaryKey = confirmAction.row.orsPrimarykeyRope;

      if (!primaryKey) {
        setError("El reporte seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.reportesOperacion.delete(primaryKey);
        setSuccess("Reporte de operación eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregRope === "1" ? "2" : "1";

        await controlObrasService.reportesOperacion.changeStatus(
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
        title="Reportes de operación"
        subtitle="Administra los reportes base de operación de equipos y maquinaria por orden de servicio."
        action={
          <Button
            variant="contained"
            startIcon={<EngineeringIcon />}
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
        emptyTitle="Sin reportes de operación"
        emptyDescription="No hay reportes de operación registrados para mostrar."
        emptyActionLabel="Crear reporte"
        onEmptyAction={handleCreate}
        minWidth={1100}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código reporte</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Fecha reporte</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Tipo registro</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyRope}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsFechareportRope}</TableCell>
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
                    {row.orsObservacionRope}
                  </Box>
                </TableCell>
                <TableCell>{row.orsTiporegistRope}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregRope} />
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
                      disabled={!row.orsIdentifkeyRope}
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

      <ReporteOperacionForm
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
            ? "Eliminar reporte de operación"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este reporte de operación?"
            : "¿Confirmas que deseas cambiar el estado de este reporte?"
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