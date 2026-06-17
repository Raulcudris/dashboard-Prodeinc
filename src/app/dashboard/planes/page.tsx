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
import FactCheckIcon from "@mui/icons-material/FactCheck";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { PlanTrabajoForm } from "../../../components/control-obras/PlanTrabajoForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { PlanTrabajoDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: PlanTrabajoDto }
  | { type: "status"; row: PlanTrabajoDto }
  | null;

function buildRowKey(row: PlanTrabajoDto, index: number) {
  return (
    row.orsPrimarykeyPltr ??
    row.orsIdentifkeyPltr ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${row.orsIdentifkeyPunt ?? "PUNT"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat("es-CO").format(value ?? 0);
}

export default function PlanesTrabajoPage() {
  const router = useRouter();

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
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyPltr,
        row.orsIdentifkeyOrde,
        row.orsIdentifkeyPunt,
        row.orsDesactividadPltr,
        row.orsIdentifkeyRseq,
        row.prvIdentifkeyInve,
        row.orsCantidunidadRseq,
        row.orsValorunidadRseq,
        row.orsValortotalRseq,
        row.orsTiporegistPltr,
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

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los planes de trabajo."
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

  const handleEdit = (row: PlanTrabajoDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: PlanTrabajoDto) => {
    if (!row.orsIdentifkeyPltr) return;

    router.push(`/dashboard/planes/${row.orsIdentifkeyPltr}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: PlanTrabajoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPltr) {
        await controlObrasService.planes.update(
          selectedRow.orsPrimarykeyPltr,
          data
        );

        setSuccess("Plan de trabajo actualizado correctamente.");
      } else {
        await controlObrasService.planes.create(data);
        setSuccess("Plan de trabajo creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el plan de trabajo."
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

      const primaryKey = confirmAction.row.orsPrimarykeyPltr;

      if (!primaryKey) {
        setError("El plan seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.planes.delete(primaryKey);
        setSuccess("Plan de trabajo eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregPltr === "1" ? "2" : "1";

        await controlObrasService.planes.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado del plan actualizado correctamente.");
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
        title="Planes de trabajo"
        subtitle="Administra actividades proyectadas por orden de servicio y sitio de trabajo, incluyendo cantidades, equipos y valores."
        action={
          <Button
            variant="contained"
            startIcon={<FactCheckIcon />}
            onClick={handleCreate}
          >
            Crear plan
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
            label="Buscar plan"
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
        emptyTitle="Sin planes de trabajo"
        emptyDescription="No hay planes de trabajo registrados para mostrar."
        emptyActionLabel="Crear plan"
        onEmptyAction={handleCreate}
        minWidth={1350}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código plan</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Sitio / punto</TableCell>
              <TableCell>Actividad</TableCell>
              <TableCell>Resumen equipo</TableCell>
              <TableCell>Equipo</TableCell>
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
                <TableCell>{row.orsIdentifkeyPltr}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsIdentifkeyPunt}</TableCell>
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
                    {row.orsDesactividadPltr}
                  </Box>
                </TableCell>
                <TableCell>{row.orsIdentifkeyRseq}</TableCell>
                <TableCell>{row.prvIdentifkeyInve}</TableCell>
                <TableCell>{formatNumber(row.orsCantidunidadRseq)}</TableCell>
                <TableCell>{formatCurrency(row.orsValorunidadRseq)}</TableCell>
                <TableCell>{formatCurrency(row.orsValortotalRseq)}</TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregPltr} />
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
                      disabled={!row.orsIdentifkeyPltr}
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

      <PlanTrabajoForm
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
            ? "Eliminar plan de trabajo"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este plan de trabajo?"
            : "¿Confirmas que deseas cambiar el estado de este plan?"
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