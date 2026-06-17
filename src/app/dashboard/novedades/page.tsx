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
import ReportIcon from "@mui/icons-material/Report";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { NovedadForm } from "../../../components/control-obras/NovedadForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { NovedadDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: NovedadDto }
  | { type: "status"; row: NovedadDto }
  | null;

function buildRowKey(row: NovedadDto, index: number) {
  return (
    row.orsPrimarykeyNove ??
    row.orsIdentifkeyNove ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${index}`
  );
}

export default function NovedadesPage() {
  const router = useRouter();

  const [rows, setRows] = useState<NovedadDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<NovedadDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyNove,
        row.orsIdentifkeyOrde,
        row.orsFechreportNove,
        row.orsTiponovedadNovt,
        row.orsRegistrbaseNove,
        row.orsRegistbaseNove,
        row.orsRegistrnoveNove,
        row.orsEstadoregNove
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.novedades.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las novedades de obra."
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

  const handleEdit = (row: NovedadDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: NovedadDto) => {
    if (!row.orsIdentifkeyNove) return;

    router.push(`/dashboard/novedades/${row.orsIdentifkeyNove}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: NovedadDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyNove) {
        await controlObrasService.novedades.update(
          selectedRow.orsPrimarykeyNove,
          data
        );

        setSuccess("Novedad actualizada correctamente.");
      } else {
        await controlObrasService.novedades.create(data);
        setSuccess("Novedad creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la novedad."
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

      const primaryKey = confirmAction.row.orsPrimarykeyNove;

      if (!primaryKey) {
        setError("La novedad seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.novedades.delete(primaryKey);
        setSuccess("Novedad eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregNove === "1" ? "2" : "1";

        await controlObrasService.novedades.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado de la novedad actualizado correctamente.");
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
        title="Novedades de obra"
        subtitle="Registra novedades asociadas a órdenes de servicio, reportes diarios, actividades de campo, observaciones y eventos relevantes."
        action={
          <Button
            variant="contained"
            startIcon={<ReportIcon />}
            onClick={handleCreate}
          >
            Crear novedad
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
            label="Buscar novedad"
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
        emptyTitle="Sin novedades"
        emptyDescription="No hay novedades de obra registradas para mostrar."
        emptyActionLabel="Crear novedad"
        onEmptyAction={handleCreate}
        minWidth={1250}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código novedad</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Fecha reporte</TableCell>
              <TableCell>Tipo novedad</TableCell>
              <TableCell>Registro base</TableCell>
              <TableCell>Referencia base</TableCell>
              <TableCell>Descripción novedad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyNove}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsFechreportNove}</TableCell>
                <TableCell>{row.orsTiponovedadNovt}</TableCell>
                <TableCell>{row.orsRegistrbaseNove}</TableCell>
                <TableCell>{row.orsRegistbaseNove}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 380,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.orsRegistrnoveNove}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregNove} />
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
                      disabled={!row.orsIdentifkeyNove}
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

      <NovedadForm
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
            ? "Eliminar novedad"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta novedad de obra?"
            : "¿Confirmas que deseas cambiar el estado de esta novedad?"
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