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
import PlaceIcon from "@mui/icons-material/Place";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { SitioPuntoForm } from "../../../components/control-obras/SitioPuntoForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { SitioPuntoDto } from "../../../types/controlObras.types";

type ConfirmAction =
  | { type: "delete"; row: SitioPuntoDto }
  | { type: "status"; row: SitioPuntoDto }
  | null;

function buildRowKey(row: SitioPuntoDto, index: number) {
  return (
    row.orsPrimarykeyPunt ??
    row.orsIdentifkeyPunt ??
    `${row.orsIdentifkeyOrde ?? "ORDE"}-${index}`
  );
}

export default function SitiosPuntosPage() {
  const router = useRouter();

  const [rows, setRows] = useState<SitioPuntoDto[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SitioPuntoDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row =>
      [
        row.orsIdentifkeyPunt,
        row.orsIdentifkeyOrde,
        row.orsNombresitioPunt,
        row.sisCodproSipr,
        row.orsGeolatitudePunt,
        row.orsGeolongitudePunt,
        row.orsPathimagenPunt,
        row.orsTiporegistPunt,
        row.orsEstadoregPunt
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text))
    );
  }, [rows, filter]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.sitios.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar los sitios o puntos de trabajo."
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

  const handleEdit = (row: SitioPuntoDto) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleGoToDetail = (row: SitioPuntoDto) => {
    if (!row.orsIdentifkeyPunt) return;

    router.push(`/dashboard/sitios/${row.orsIdentifkeyPunt}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: SitioPuntoDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyPunt) {
        await controlObrasService.sitios.update(
          selectedRow.orsPrimarykeyPunt,
          data
        );

        setSuccess("Sitio o punto actualizado correctamente.");
      } else {
        await controlObrasService.sitios.create(data);
        setSuccess("Sitio o punto creado correctamente.");
      }

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar el sitio o punto de trabajo."
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

      const primaryKey = confirmAction.row.orsPrimarykeyPunt;

      if (!primaryKey) {
        setError("El sitio seleccionado no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.sitios.delete(primaryKey);
        setSuccess("Sitio o punto eliminado correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregPunt === "1" ? "2" : "1";

        await controlObrasService.sitios.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado del sitio actualizado correctamente.");
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
        title="Sitios / puntos de trabajo"
        subtitle="Administra los frentes, puntos o sitios de ejecución asociados a órdenes de servicio."
        action={
          <Button
            variant="contained"
            startIcon={<PlaceIcon />}
            onClick={handleCreate}
          >
            Crear sitio
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
            label="Buscar sitio"
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
        emptyTitle="Sin sitios registrados"
        emptyDescription="No hay sitios o puntos de trabajo registrados para mostrar."
        emptyActionLabel="Crear sitio"
        onEmptyAction={handleCreate}
        minWidth={1200}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código sitio</TableCell>
              <TableCell>Orden</TableCell>
              <TableCell>Nombre sitio</TableCell>
              <TableCell>Código proyecto</TableCell>
              <TableCell>Latitud</TableCell>
              <TableCell>Longitud</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={buildRowKey(row, index)}>
                <TableCell>{row.orsIdentifkeyPunt}</TableCell>
                <TableCell>{row.orsIdentifkeyOrde}</TableCell>
                <TableCell>{row.orsNombresitioPunt}</TableCell>
                <TableCell>{row.sisCodproSipr}</TableCell>
                <TableCell>{row.orsGeolatitudePunt}</TableCell>
                <TableCell>{row.orsGeolongitudePunt}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "middle"
                    }}
                  >
                    {row.orsPathimagenPunt}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip value={row.orsEstadoregPunt} />
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
                      disabled={!row.orsIdentifkeyPunt}
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

      <SitioPuntoForm
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
            ? "Eliminar sitio o punto"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar este sitio o punto de trabajo?"
            : "¿Confirmas que deseas cambiar el estado de este sitio?"
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