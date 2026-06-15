"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { LoadingBox } from "../../../components/common/LoadingBox";
import { EmptyState } from "../../../components/common/EmptyState";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { NovedadForm } from "../../../components/control-obras/NovedadForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { NovedadDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: NovedadDto }
  | { type: "status"; row: NovedadDto }
  | null;

export default function NovedadesPage() {
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

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.orsIdentifkeyNove,
        row.orsIdentifkeyOrde,
        row.orsTiponovedadNovt,
        row.orsRegistrbaseNove,
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

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar las novedades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRows();
  }, []);

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
      setError((err as { message?: string }).message ?? "No fue posible guardar la novedad.");
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
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.novedades.delete(primaryKey);
        setSuccess("Novedad eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.orsEstadoregNove === "1" ? "2" : "1";
        await controlObrasService.novedades.changeStatus(primaryKey, nextStatus);
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
        title="Novedades"
        subtitle="Registro de novedades, observaciones, eventos y situaciones presentadas en obra."
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedRow(null);
              setOpenForm(true);
            }}
          >
            Crear novedad
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
              title="Sin novedades"
              description="No hay novedades registradas."
              actionLabel="Crear novedad"
              onAction={() => setOpenForm(true)}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Registro base</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.orsPrimarykeyNove ?? row.orsIdentifkeyNove}>
                    <TableCell>{row.orsIdentifkeyNove}</TableCell>
                    <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                    <TableCell>{row.orsFechreportNove}</TableCell>
                    <TableCell>{row.orsTiponovedadNovt}</TableCell>
                    <TableCell>{row.orsRegistrbaseNove}</TableCell>
                    <TableCell>{row.orsRegistrnoveNove}</TableCell>
                    <TableCell><StatusChip value={row.orsEstadoregNove} /></TableCell>
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

      <NovedadForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar novedad" : "Cambiar estado"}
        message={confirmAction?.type === "delete" ? "¿Confirmas que deseas eliminar esta novedad?" : "¿Confirmas que deseas cambiar el estado?"}
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}