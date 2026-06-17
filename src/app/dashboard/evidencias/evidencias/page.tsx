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
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../../components/common/CrudActionButtons";
import { EvidenciaForm } from "../../../../components/evidencias/EvidenciaForm";
import { evidenciasService } from "../../../../services/evidencias.service";
import { EvidenciaDto } from "../../../../types/evidencias.types";

type ConfirmAction =
  | { type: "delete"; row: EvidenciaDto }
  | { type: "status"; row: EvidenciaDto }
  | null;

function buildRowKey(row: EvidenciaDto, index: number) {
  return (
    row.eviPrimarykeyEvid ??
    row.eviIdentifkeyEvid ??
    `${row.eviNombrearchivoEvid ?? "EVID"}-${index}`
  );
}

export default function EvidenciasPage() {
  const router = useRouter();

  const [rows, setRows] = useState<EvidenciaDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EvidenciaDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.eviIdentifkeyEvid,
        row.eviIdentifkeyTiev,
        row.eviNombrearchivoEvid,
        row.eviDescripcionEvid,
        row.eviUrlarchivoEvid,
        row.eviFechacapturaEvid,
        row.eviTiporegistEvid,
        row.eviEstadoregEvid
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await evidenciasService.evidencias.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las evidencias."
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

  const handleEdit = (row: EvidenciaDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: EvidenciaDto) => {
    if (!row.eviIdentifkeyEvid) return;

    router.push(`/dashboard/evidencias/evidencias/${row.eviIdentifkeyEvid}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: EvidenciaDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.eviPrimarykeyEvid) {
        await evidenciasService.evidencias.update(
          selectedRow.eviPrimarykeyEvid,
          data
        );

        setSuccess("Evidencia actualizada correctamente.");
      } else {
        await evidenciasService.evidencias.create(data);
        setSuccess("Evidencia creada correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la evidencia."
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

      const primaryKey = confirmAction.row.eviPrimarykeyEvid;

      if (!primaryKey) {
        setError("La evidencia seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await evidenciasService.evidencias.delete(primaryKey);
        setSuccess("Evidencia eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.eviEstadoregEvid === "1" ? "2" : "1";

        await evidenciasService.evidencias.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado de la evidencia actualizado correctamente.");
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
        title="Evidencias / fotos"
        subtitle="Administra fotografías, archivos, soportes documentales, coordenadas, fechas de captura y URLs asociadas a registros de obra."
        action={
          <Button
            variant="contained"
            startIcon={<PhotoLibraryIcon />}
            onClick={handleCreate}
          >
            Crear evidencia
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
            label="Buscar evidencia"
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
        emptyTitle="Sin evidencias"
        emptyDescription="No hay evidencias registradas para mostrar."
        emptyActionLabel="Crear evidencia"
        onEmptyAction={handleCreate}
        minWidth={1350}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código evidencia</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Archivo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha captura</TableCell>
              <TableCell>Latitud</TableCell>
              <TableCell>Longitud</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.eviIdentifkeyEvid}</TableCell>
                <TableCell>{row.eviIdentifkeyTiev}</TableCell>
                <TableCell>{row.eviNombrearchivoEvid}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 280,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.eviDescripcionEvid}
                  </Box>
                </TableCell>
                <TableCell>{row.eviFechacapturaEvid}</TableCell>
                <TableCell>{row.eviLatitudEvid}</TableCell>
                <TableCell>{row.eviLongitudEvid}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 280,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.eviUrlarchivoEvid}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip value={row.eviEstadoregEvid} />
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
                      disabled={!row.eviIdentifkeyEvid}
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

      <EvidenciaForm
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
            ? "Eliminar evidencia"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta evidencia?"
            : "¿Confirmas que deseas cambiar el estado de esta evidencia?"
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