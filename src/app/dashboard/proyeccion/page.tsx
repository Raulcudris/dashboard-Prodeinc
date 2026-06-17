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
import { ProyeccionSemanalForm } from "../../../components/control-obras/ProyeccionForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { ProyeccionDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: ProyeccionDto }
  | { type: "status"; row: ProyeccionDto }
  | null;

function buildRowKey(row: ProyeccionDto, index: number) {
  return (
    row.orsPrimarykeyPsem ??
    row.orsIdentifkeyPsem ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${index}`
  );
}

export default function ProyeccionSemanalPage() {
  const router = useRouter();

  const [rows, setRows] = useState<ProyeccionDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ProyeccionDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyPsem,
        row.orsIdentifkeyOrde,
        row.orsNumsemanaPsem,
        row.orsFechainicioPsem,
        row.orsFechafinPsem,
        row.orsDescripcionPsem,
        row.orsTiporegistPsem,
        row.orsEstadoregPsem
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.proyeccionSemanal.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar la proyección semanal."
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

  const handleEdit = (row: ProyeccionDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: ProyeccionDto) => {
    if (!row.orsIdentifkeyPsem) return;

    router.push(`/dashboard/proyeccion/${row.orsIdentifkeyPsem}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: ProyeccionDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPsem) {
        await controlObrasService.proyeccionSemanal.update(
          selectedRow.orsPrimarykeyPsem,
          data
        );

        setSuccess("Proyección semanal actualizada correctamente.");
      } else {
        await controlObrasService.proyeccionSemanal.create(data);
        setSuccess("Proyección semanal creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la proyección semanal."
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

      const primaryKey = confirmAction.row.orsPrimarykeyPsem;

      if (!primaryKey) {
        setError("La proyección seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.proyeccionSemanal.delete(primaryKey);
        setSuccess("Proyección semanal eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregPsem === "1" ? "2" : "1";

        await controlObrasService.proyeccionSemanal.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado de la proyección semanal actualizado correctamente.");
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
        title="Proyección semanal"
        subtitle="Administra las semanas proyectadas de ejecución asociadas a órdenes de servicio."
        action={
          <Button
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            onClick={handleCreate}
          >
            Crear proyección
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
            label="Buscar proyección"
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
        emptyTitle="Sin proyecciones semanales"
        emptyDescription="No hay proyecciones semanales registradas para mostrar."
        emptyActionLabel="Crear proyección"
        onEmptyAction={handleCreate}
        minWidth={1120}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código proyección</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Semana</TableCell>
              <TableCell>Fecha inicio</TableCell>
              <TableCell>Fecha fin</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyPsem}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsNumsemanaPsem ?? 0}</TableCell>
                <TableCell>{row.orsFechainicioPsem}</TableCell>
                <TableCell>{row.orsFechafinPsem}</TableCell>
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
                    {row.orsDescripcionPsem}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregPsem} />
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
                      disabled={!row.orsIdentifkeyPsem}
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

      <ProyeccionSemanalForm
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
            ? "Eliminar proyección semanal"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta proyección semanal?"
            : "¿Confirmas que deseas cambiar el estado de esta proyección semanal?"
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