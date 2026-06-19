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
import LinkIcon from "@mui/icons-material/Link";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { ReferenciaEvidenciaForm } from "../../../../components/evidencias/ReferenciaEvidenciaForm";
import { evidenciasService } from "../../../../services/evidencias.service";
import { ReferenciaEvidenciaDto } from "../../../../types/evidencias.types";

type ConfirmAction =
  | { type: "delete"; row: ReferenciaEvidenciaDto }
  | { type: "status"; row: ReferenciaEvidenciaDto }
  | null;

function blurActiveElement() {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function openModalSafely(callback: () => void) {
  blurActiveElement();
  window.requestAnimationFrame(() => callback());
}

function buildRowKey(row: ReferenciaEvidenciaDto, index: number) {
  return (
    row.eviPrimarykeyRefe ??
    row.eviIdentifkeyRefe ??
    `${row.eviIdentifkeyEvid ?? "REFE"}-${index}`
  );
}

export default function ReferenciasEvidenciasPage() {
  const [rows, setRows] = useState<ReferenciaEvidenciaDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<ReferenciaEvidenciaDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.eviIdentifkeyRefe,
        row.eviIdentifkeyEvid,
        row.eviTiporegistroRefe,
        row.eviIdentifregistroRefe,
        row.eviObservacionRefe,
        row.eviTiporegistRefe,
        row.eviEstadoregRefe
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await evidenciasService.referencias.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las referencias de evidencias."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

  const handleCreate = () => {
    openModalSafely(() => {
      setSelectedRow(null);
      setOpenForm(true);
    });
  };

  const handleEdit = (row: ReferenciaEvidenciaDto) => {
    openModalSafely(() => {
      setSelectedRow(row);
      setOpenForm(true);
    });
  };

  const handleChangeStatus = (row: ReferenciaEvidenciaDto) => {
    openModalSafely(() => {
      setConfirmAction({ type: "status", row });
    });
  };

  const handleDelete = (row: ReferenciaEvidenciaDto) => {
    openModalSafely(() => {
      setConfirmAction({ type: "delete", row });
    });
  };

  const handleCloseForm = () => {
    if (saving) return;

    blurActiveElement();
    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleCloseConfirm = () => {
    if (saving) return;

    blurActiveElement();
    setConfirmAction(null);
  };

  const handleSubmit = async (data: ReferenciaEvidenciaDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.eviPrimarykeyRefe) {
        await evidenciasService.referencias.update(
          selectedRow.eviPrimarykeyRefe,
          data
        );

        setSuccess("Referencia de evidencia actualizada correctamente.");
      } else {
        await evidenciasService.referencias.create(data);
        setSuccess("Referencia de evidencia creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la referencia de evidencia."
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

      const primaryKey = confirmAction.row.eviPrimarykeyRefe;

      if (!primaryKey) {
        setError("La referencia seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await evidenciasService.referencias.delete(primaryKey);
        setSuccess("Referencia de evidencia eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.eviEstadoregRefe === "1" ? "2" : "1";

        await evidenciasService.referencias.changeStatus(
          primaryKey,
          nextStatus
        );

        setSuccess("Estado de la referencia actualizado correctamente.");
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
        title="Referencias de evidencias"
        subtitle="Relaciona cada evidencia con el registro de obra correspondiente: reporte diario, novedad, orden, sitio, plan, acta o detalle operativo."
        action={
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onMouseDown={event => event.preventDefault()}
            onClick={handleCreate}
          >
            Crear referencia
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
            label="Buscar referencia"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={
          <Button
            variant="outlined"
            onMouseDown={event => event.preventDefault()}
            onClick={loadRows}
          >
            Actualizar
          </Button>
        }
      />

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin referencias"
        emptyDescription="No hay referencias de evidencias registradas para mostrar."
        emptyActionLabel="Crear referencia"
        onEmptyAction={handleCreate}
        minWidth={1080}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código referencia</TableCell>
              <TableCell>Evidencia</TableCell>
              <TableCell>Tipo registro</TableCell>
              <TableCell>Registro relacionado</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Tipo registro interno</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.eviIdentifkeyRefe}</TableCell>
                <TableCell>{row.eviIdentifkeyEvid}</TableCell>
                <TableCell>{row.eviTiporegistroRefe}</TableCell>
                <TableCell>{row.eviIdentifregistroRefe}</TableCell>
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
                    {row.eviObservacionRefe}
                  </Box>
                </TableCell>
                <TableCell>{row.eviTiporegistRefe}</TableCell>
                <TableCell>
                  <StatusChip value={row.eviEstadoregRefe} />
                </TableCell>
                <TableCell align="right">
                  <CrudActionButtons
                    disabled={saving}
                    onEdit={() => handleEdit(row)}
                    onChangeStatus={() => handleChangeStatus(row)}
                    onDelete={() => handleDelete(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CrudTableCard>

      <ReferenciaEvidenciaForm
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
            ? "Eliminar referencia"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta referencia de evidencia?"
            : "¿Confirmas que deseas cambiar el estado de esta referencia?"
        }
        confirmText={
          confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"
        }
        onClose={handleCloseConfirm}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}