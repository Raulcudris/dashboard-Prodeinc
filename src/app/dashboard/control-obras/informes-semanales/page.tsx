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
import AssessmentIcon from "@mui/icons-material/Assessment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { InformeSemanalForm } from "../../../../components/control-obras/InformeSemanalForm";
import { controlObrasService } from "../../../../services/controlObras.service";
import { InformeSemanalDto } from "../../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: InformeSemanalDto }
  | { type: "status"; row: InformeSemanalDto }
  | null;

function buildRowKey(row: InformeSemanalDto, index: number) {
  return (
    row.orsPrimarykeyInse ??
    row.orsIdentifkeyInse ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${row.orsIdentifkeyPsem ?? "PSEM"}-${index}`
  );
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function InformesSemanalesPage() {
  const router = useRouter();

  const [rows, setRows] = useState<InformeSemanalDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InformeSemanalDto | null>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyInse,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPsem,
        row.orsIdentifkeyPlse,
        row.orsFechainicioInse,
        row.orsFechafinInse,
        row.orsDescripcionInse,
        row.orsObservacionInse,
        row.orsAvanceprogramadoInse,
        row.orsAvanceejecutadoInse,
        row.orsPorccumplimientoInse,
        row.orsTiporegistInse,
        row.orsEstadoregInse
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.informesSemanales.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los informes semanales."
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

  const handleEdit = (row: InformeSemanalDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: InformeSemanalDto) => {
    if (!row.orsIdentifkeyInse) return;

    router.push(
      `/dashboard/control-obras/informes-semanales/${row.orsIdentifkeyInse}`
    );
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: InformeSemanalDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyInse) {
        await controlObrasService.informesSemanales.update(
          selectedRow.orsPrimarykeyInse,
          data
        );

        setSuccess("Informe semanal actualizado correctamente.");
      } else {
        await controlObrasService.informesSemanales.create(data);
        setSuccess("Informe semanal creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el informe semanal."
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

      const primaryKey = confirmAction.row.orsPrimarykeyInse;

      if (!primaryKey) {
        setError("El informe seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.informesSemanales.delete(primaryKey);
        setSuccess("Informe semanal eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregInse === "1" ? "2" : "1";

        await controlObrasService.informesSemanales.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado del informe semanal actualizado correctamente.");
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
        title="Informes semanales"
        subtitle="Consolida avance programado, avance ejecutado y porcentaje de cumplimiento por orden, proyección o plan semanal."
        action={
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={handleCreate}
          >
            Crear informe
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
            label="Buscar informe"
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
        emptyTitle="Sin informes semanales"
        emptyDescription="No hay informes semanales registrados para mostrar."
        emptyActionLabel="Crear informe"
        onEmptyAction={handleCreate}
        minWidth={1320}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código informe</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Proyección</TableCell>
              <TableCell>Plan semanal</TableCell>
              <TableCell>Inicio</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Programado</TableCell>
              <TableCell>Ejecutado</TableCell>
              <TableCell>Cumplimiento</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyInse}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                <TableCell>{row.orsIdentifkeyPlse}</TableCell>
                <TableCell>{row.orsFechainicioInse}</TableCell>
                <TableCell>{row.orsFechafinInse}</TableCell>
                <TableCell>
                  {formatNumber(row.orsAvanceprogramadoInse)}
                </TableCell>
                <TableCell>
                  {formatNumber(row.orsAvanceejecutadoInse)}
                </TableCell>
                <TableCell>
                  {formatNumber(row.orsPorccumplimientoInse)}%
                </TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregInse} />
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
                      disabled={!row.orsIdentifkeyInse}
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

      <InformeSemanalForm
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
            ? "Eliminar informe semanal"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este informe semanal?"
            : "¿Confirmas que deseas cambiar el estado de este informe semanal?"
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