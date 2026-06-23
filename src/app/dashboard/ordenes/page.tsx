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
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";

import { PageHeader } from "../../../components/layout/PageHeader";
import { PageToolbar } from "../../../components/common/PageToolbar";
import { StatusChip } from "../../../components/common/StatusChip";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { CrudTableCard } from "../../../components/common/CrudTableCard";
import { CrudActionButtons } from "../../../components/common/CrudActionButtons";
import { OrdenServicioForm } from "../../../components/control-obras/OrdenServicioForm";
import { controlObrasService } from "../../../services/controlObras.service";
import { proveedoresService } from "../../../services/proveedores.service";
import {
  OrdenServicioDto,
  ServicioBasicoDto
} from "../../../types/controlObras.types";
import { ProveedorDto } from "../../../types/proveedores.types";

type ConfirmAction =
  | { type: "delete"; row: OrdenServicioDto }
  | { type: "status"; row: OrdenServicioDto }
  | null;

function buildRowKey(row: OrdenServicioDto, index: number) {
  return (
    row.orsPrimarykeyOrde ??
    row.orsIdentifkeyOrde ??
    `${row.orsCodservicioSebs ?? "ORDE"}-${index}`
  );
}

function formatCurrency(value?: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value ?? 0)}`;
}

function blurActiveElement() {
  if (typeof document === "undefined") return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}

function openModalSafely(callback: () => void) {
  blurActiveElement();

  window.requestAnimationFrame(() => {
    callback();
  });
}

function getRecordStringValue(item: unknown, fieldName: string) {
  if (!item || typeof item !== "object") return undefined;

  const record = item as Record<string, unknown>;
  const value = record[fieldName];

  return typeof value === "string" ? value : undefined;
}

function getProveedorKey(proveedor: ProveedorDto) {
  return getRecordStringValue(proveedor, "prvIdentifkeyMprv") ?? "";
}

function getProveedorLabel(proveedor: ProveedorDto) {
  const razonSocial = getRecordStringValue(proveedor, "prvRazonsocialMprv");
  const numeroNit = getRecordStringValue(proveedor, "prvNumeronitMprv");
  const proveedorKey = getProveedorKey(proveedor);

  if (razonSocial && numeroNit) {
    return `${razonSocial} - NIT ${numeroNit}`;
  }

  if (razonSocial) return razonSocial;
  if (numeroNit) return `NIT ${numeroNit}`;

  return proveedorKey;
}

function getServicioBasicoLabel(servicio: ServicioBasicoDto) {
  const codigo = servicio.orsCodservicioSebs;
  const descripcion = servicio.orsDesservicioSebs;

  if (codigo && descripcion) return `${codigo} - ${descripcion}`;
  if (descripcion) return descripcion;

  return codigo;
}

export default function OrdenesServicioPage() {
  const router = useRouter();

  const [rows, setRows] = useState<OrdenServicioDto[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [serviciosBasicos, setServiciosBasicos] = useState<
    ServicioBasicoDto[]
  >([]);

  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [saving, setSaving] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OrdenServicioDto | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const [error, setError] = useState<string | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const servicioBasicoByKey = useMemo(() => {
    return new Map(
      serviciosBasicos
        .filter(servicio => servicio.orsCodservicioSebs)
        .map(servicio => [servicio.orsCodservicioSebs, servicio])
    );
  }, [serviciosBasicos]);

  const proveedorByKey = useMemo(() => {
    return new Map(
      proveedores
        .map(proveedor => [getProveedorKey(proveedor), proveedor] as const)
        .filter(([proveedorKey]) => Boolean(proveedorKey))
    );
  }, [proveedores]);

  const filteredRows = useMemo(() => {
    const text = filter.trim().toLowerCase();
    const validRows = rows.filter(Boolean);

    if (!text) return validRows;

    return validRows.filter(row => {
      const servicioBasico = row.orsCodservicioSebs
        ? servicioBasicoByKey.get(row.orsCodservicioSebs)
        : undefined;

      const proveedor = row.prvIdentifkeyMprv
        ? proveedorByKey.get(row.prvIdentifkeyMprv)
        : undefined;

      return [
        row.orsIdentifkeyOrde,
        row.orsCodservicioSebs,
        servicioBasico ? getServicioBasicoLabel(servicioBasico) : undefined,
        row.orsServiceventOrde,
        row.orsServiclugarOrde,
        row.orsServicobjetoOrde,
        row.prvIdentifkeyMprv,
        proveedor ? getProveedorLabel(proveedor) : undefined,
        row.prvIdentifkeyRelg,
        row.orsTiporegistOrde,
        row.orsEstadoregOrde
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(text));
    });
  }, [rows, filter, proveedorByKey, servicioBasicoByKey]);

  const loadRows = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await controlObrasService.ordenes.getPages({
        currentPage: 1,
        pageSize: 50,
        parameter: "TEXT",
        filter: ""
      });

      setRows((response.rspData ?? []).filter(Boolean));
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible cargar las órdenes de servicio."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);
      setCatalogError(null);

      const proveedoresResponse = await proveedoresService.getByEstado("1");

      setProveedores((proveedoresResponse.rspData ?? []).filter(Boolean));

      /*
       * Servicios básicos queda vacío temporalmente porque el backend actual
       * no expone /api/control-obras/servicios-basicos.
       *
       * El formulario seguirá mostrando el campo Código servicio como entrada
       * manual. Cuando el backend exponga ese módulo, aquí se puede volver a
       * cargar el catálogo real.
       */
      setServiciosBasicos([]);
    } catch (err) {
      setProveedores([]);
      setServiciosBasicos([]);

      setCatalogError(
        (err as { message?: string }).message ??
          "No fue posible cargar los proveedores."
      );
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    void loadRows();
    void loadCatalogs();
  }, []);

  const handleCreate = () => {
    openModalSafely(() => {
      setSelectedRow(null);
      setOpenForm(true);
    });
  };

  const handleEdit = (row: OrdenServicioDto) => {
    openModalSafely(() => {
      setSelectedRow(row);
      setOpenForm(true);
    });
  };

  const handleGoToDetail = (row: OrdenServicioDto) => {
    blurActiveElement();

    if (!row.orsIdentifkeyOrde) return;

    router.push(`/dashboard/ordenes/${row.orsIdentifkeyOrde}`);
  };

  const handleCloseForm = () => {
    if (saving) return;

    blurActiveElement();

    setOpenForm(false);
    setSelectedRow(null);
  };

  const handleSubmit = async (data: OrdenServicioDto) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (selectedRow?.orsPrimarykeyOrde) {
        await controlObrasService.ordenes.update(
          selectedRow.orsPrimarykeyOrde,
          data
        );

        setSuccess("Orden de servicio actualizada correctamente.");
      } else {
        await controlObrasService.ordenes.create(data);
        setSuccess("Orden de servicio creada correctamente.");
      }

      blurActiveElement();

      setOpenForm(false);
      setSelectedRow(null);

      await loadRows();
    } catch (err) {
      setError(
        (err as { message?: string }).message ??
          "No fue posible guardar la orden de servicio."
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

      const primaryKey = confirmAction.row.orsPrimarykeyOrde;

      if (!primaryKey) {
        setError("La orden seleccionada no tiene llave primaria.");
        return;
      }

      if (confirmAction.type === "delete") {
        await controlObrasService.ordenes.delete(primaryKey);
        setSuccess("Orden de servicio eliminada correctamente.");
      }

      if (confirmAction.type === "status") {
        const nextStatus =
          confirmAction.row.orsEstadoregOrde === "1" ? "2" : "1";

        await controlObrasService.ordenes.changeStatus(primaryKey, nextStatus);

        setSuccess("Estado de la orden actualizado correctamente.");
      }

      blurActiveElement();

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

  const handleCloseConfirm = () => {
    if (saving) return;

    blurActiveElement();

    setConfirmAction(null);
  };

  const handleRefresh = async () => {
    await Promise.all([loadRows(), loadCatalogs()]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <PageHeader
        title="Órdenes de servicio"
        subtitle="Administra las órdenes base de obra civil, valores, fechas, proveedores, lugares y objetos contractuales."
        action={
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onMouseDown={event => event.preventDefault()}
            onClick={handleCreate}
          >
            Crear orden
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {catalogError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {catalogError}
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
            label="Buscar orden"
            value={filter}
            onChange={event => setFilter(event.target.value)}
          />
        }
        right={
          <Button
            variant="outlined"
            disabled={loading || loadingCatalogs}
            onMouseDown={event => event.preventDefault()}
            onClick={handleRefresh}
          >
            Actualizar
          </Button>
        }
      />

      <CrudTableCard
        loading={loading}
        isEmpty={filteredRows.length === 0}
        emptyTitle="Sin órdenes de servicio"
        emptyDescription="No hay órdenes de servicio registradas para mostrar."
        emptyActionLabel="Crear orden"
        onEmptyAction={handleCreate}
        minWidth={1520}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código orden</TableCell>
              <TableCell>Código servicio</TableCell>
              <TableCell>Fecha autorización</TableCell>
              <TableCell>Evento / servicio</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Objeto</TableCell>
              <TableCell>Inicio plan</TableCell>
              <TableCell>Fin plan</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Valor base</TableCell>
              <TableCell>IVA</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => {
              const servicioBasico = row.orsCodservicioSebs
                ? servicioBasicoByKey.get(row.orsCodservicioSebs)
                : undefined;

              const proveedor = row.prvIdentifkeyMprv
                ? proveedorByKey.get(row.prvIdentifkeyMprv)
                : undefined;

              return (
                <TableRow key={buildRowKey(row, index)}>
                  <TableCell>{row.orsIdentifkeyOrde}</TableCell>

                  <TableCell>
                    {servicioBasico
                      ? getServicioBasicoLabel(servicioBasico)
                      : row.orsCodservicioSebs}
                  </TableCell>

                  <TableCell>{row.orsAutorifechaOrde}</TableCell>
                  <TableCell>{row.orsServiceventOrde}</TableCell>
                  <TableCell>{row.orsServiclugarOrde}</TableCell>

                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        maxWidth: 320,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        verticalAlign: "middle"
                      }}
                    >
                      {row.orsServicobjetoOrde}
                    </Box>
                  </TableCell>

                  <TableCell>{row.orsPlanfechiniOrde}</TableCell>
                  <TableCell>{row.orsPlanfechfinOrde}</TableCell>

                  <TableCell>
                    {proveedor
                      ? getProveedorLabel(proveedor)
                      : row.prvIdentifkeyMprv}
                  </TableCell>

                  <TableCell>{formatCurrency(row.orsValorbaseOrde)}</TableCell>
                  <TableCell>{formatCurrency(row.orsValordeivaOrde)}</TableCell>
                  <TableCell>{formatCurrency(row.orsValortotalOrde)}</TableCell>

                  <TableCell>
                    <StatusChip value={row.orsEstadoregOrde} />
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
                        disabled={!row.orsIdentifkeyOrde}
                        onMouseDown={event => event.preventDefault()}
                        onClick={() => handleGoToDetail(row)}
                      >
                        Detalle
                      </Button>

                      <CrudActionButtons
                        disabled={saving}
                        onEdit={() => handleEdit(row)}
                        onChangeStatus={() => {
                          openModalSafely(() => {
                            setConfirmAction({ type: "status", row });
                          });
                        }}
                        onDelete={() => {
                          openModalSafely(() => {
                            setConfirmAction({ type: "delete", row });
                          });
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CrudTableCard>

      <OrdenServicioForm
        open={openForm}
        loading={saving}
        initialData={selectedRow}
        proveedores={proveedores}
        serviciosBasicos={serviciosBasicos}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!confirmAction}
        loading={saving}
        title={
          confirmAction?.type === "delete"
            ? "Eliminar orden de servicio"
            : "Cambiar estado"
        }
        message={
          confirmAction?.type === "delete"
            ? "¿Confirmas que deseas eliminar esta orden de servicio?"
            : "¿Confirmas que deseas cambiar el estado de esta orden?"
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