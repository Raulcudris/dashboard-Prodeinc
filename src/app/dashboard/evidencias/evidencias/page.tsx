"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { PageToolbar } from "../../../../components/common/PageToolbar";
import { LoadingBox } from "../../../../components/common/LoadingBox";
import { EmptyState } from "../../../../components/common/EmptyState";
import { StatusChip } from "../../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../../components/common/ConfirmDialog";
import { EvidenciaForm } from "../../../../components/evidencias/EvidenciaForm";
import { evidenciasService } from "../../../../services/evidencias.service";
import { EvidenciaDto } from "../../../../types/evidencias.types";

type ConfirmAction =
  | { type: "delete"; row: EvidenciaDto }
  | { type: "status"; row: EvidenciaDto }
  | null;

export default function EvidenciasFotosPage() {
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

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.eviIdentifkeyEvid,
        row.eviIdentifkeyTiev,
        row.eviNombrearchivoEvid,
        row.eviDescripcionEvid,
        row.eviUrlarchivoEvid,
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

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar las evidencias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

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
      setError((err as { message?: string }).message ?? "No fue posible guardar la evidencia.");
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
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await evidenciasService.evidencias.delete(primaryKey);
        setSuccess("Evidencia eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.eviEstadoregEvid === "1" ? "2" : "1";
        await evidenciasService.evidencias.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado actualizado correctamente.");
      }

      setConfirmAction(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible ejecutar la acción.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Evidencias / Fotos"
        subtitle="Gestión de fotos, videos, documentos y soportes asociados al flujo principal de obra."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setOpenForm(true);
            }}
          >
            Crear evidencia
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={<Button variant="outlined" onClick={loadRows}>Actualizar</Button>}
      />

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin evidencias"
              description="No hay evidencias o fotos registradas."
              actionLabel="Crear evidencia"
              onAction={() => setOpenForm(true)}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Archivo</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Fecha captura</TableCell>
                  <TableCell>Latitud</TableCell>
                  <TableCell>Longitud</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.eviPrimarykeyEvid ?? row.eviIdentifkeyEvid}>
                    <TableCell>{row.eviIdentifkeyEvid}</TableCell>
                    <TableCell>{row.eviIdentifkeyTiev}</TableCell>
                    <TableCell>{row.eviNombrearchivoEvid}</TableCell>
                    <TableCell>
                      {row.eviUrlarchivoEvid ? (
                        <MuiLink
                          href={row.eviUrlarchivoEvid}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Abrir
                        </MuiLink>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{row.eviFechacapturaEvid}</TableCell>
                    <TableCell>{row.eviLatitudEvid}</TableCell>
                    <TableCell>{row.eviLongitudEvid}</TableCell>
                    <TableCell><StatusChip value={row.eviEstadoregEvid} /></TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => { setSelectedRow(row); setOpenForm(true); }}>
                        Editar
                      </Button>
                      <Button size="small" onClick={() => setConfirmAction({ type: "status", row })}>
                        Estado
                      </Button>
                      <Button size="small" color="error" onClick={() => setConfirmAction({ type: "delete", row })}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EvidenciaForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar evidencia" : "Cambiar estado"}
        message={confirmAction?.type === "delete" ? "¿Confirmas que deseas eliminar esta evidencia?" : "¿Confirmas que deseas cambiar el estado?"}
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}