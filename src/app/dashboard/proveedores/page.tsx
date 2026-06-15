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
import { ProveedorForm } from "../../../components/proveedores/ProveedorForm";
import { proveedoresService } from "../../../services/proveedores.service";
import { ProveedorDto } from "../../../types/proveedores.types";

type ConfirmAction =
  | { type: "delete"; row: ProveedorDto }
  | { type: "status"; row: ProveedorDto }
  | null;

export default function ProveedoresPage() {
  const [rows, setRows] = useState<ProveedorDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProveedorDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();

    if (!text) return rows;

    return rows.filter(row =>
      [
        row.prvIdentifkeyMprv,
        row.prvNumeronitMprv,
        row.prvRazonsocialMprv,
        row.sisTiposociedadTpso,
        row.sisCodactividadCiiu,
        row.prvCorreoMprv,
        row.prvTelefonoMprv,
        row.prvEstadoregMprv
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await proveedoresService.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows(response.rspData ?? []);
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible cargar los proveedores.");
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

  const handleEdit = (row: ProveedorDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleSubmit = async (data: ProveedorDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.prvPrimarykeyMprv) {
        await proveedoresService.update(selectedRow.prvPrimarykeyMprv, data);
        setSuccess("Proveedor actualizado correctamente.");
      } else {
        await proveedoresService.create(data);
        setSuccess("Proveedor creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);
      await loadRows();
    } catch (err) {
      setError((err as { message?: string }).message ?? "No fue posible guardar el proveedor.");
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

      const primaryKey = confirmAction.row.prvPrimarykeyMprv;

      if (!primaryKey) {
        setError("El registro no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await proveedoresService.delete(primaryKey);
        setSuccess("Proveedor eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus = confirmAction.row.prvEstadoregMprv === "1" ? "2" : "1";
        await proveedoresService.changeStatus(primaryKey, nextStatus);
        setSuccess("Estado del proveedor actualizado correctamente.");
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
        title="Proveedores"
        subtitle="Gestión de proveedores de maquinaria, suministros y servicios."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Crear proveedor
          </Button>
        }
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <PageToolbar
        left={
          <TextField
            size="small"
            label="Buscar proveedor"
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

      <Card>
        <CardContent>
          {loading ? (
            <LoadingBox />
          ) : filteredRows.length === 0 ? (
            <EmptyState
              title="Sin proveedores"
              description="No hay proveedores registrados."
              actionLabel="Crear proveedor"
              onAction={handleCreate}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>NIT</TableCell>
                  <TableCell>Razón social</TableCell>
                  <TableCell>Tipo sociedad</TableCell>
                  <TableCell>CIIU</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.map(row => (
                  <TableRow key={row.prvPrimarykeyMprv ?? row.prvIdentifkeyMprv}>
                    <TableCell>{row.prvIdentifkeyMprv}</TableCell>
                    <TableCell>{row.prvNumeronitMprv}</TableCell>
                    <TableCell>{row.prvRazonsocialMprv}</TableCell>
                    <TableCell>{row.sisTiposociedadTpso}</TableCell>
                    <TableCell>{row.sisCodactividadCiiu}</TableCell>
                    <TableCell>{row.prvTelefonoMprv}</TableCell>
                    <TableCell>{row.prvCorreoMprv}</TableCell>
                    <TableCell>
                      <StatusChip value={row.prvEstadoregMprv} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => handleEdit(row)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setConfirmAction({ type: "status", row })}
                      >
                        Estado
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setConfirmAction({ type: "delete", row })}
                      >
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

      <ProveedorForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={confirmAction?.type === "delete" ? "Eliminar proveedor" : "Cambiar estado"}
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este proveedor?"
            : "¿Confirmas que deseas cambiar el estado de este proveedor?"
        }
        confirmText={confirmAction?.type === "delete" ? "Eliminar" : "Cambiar estado"}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
      />
    </Box>
  );
}