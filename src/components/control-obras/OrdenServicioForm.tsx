"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import {
  OrdenServicioDto,
  ServicioBasicoDto
} from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";
import { ProveedorDto } from "../../types/proveedores.types";

interface FormValues {
  orsIdentifkeyOrde: string;
  orsAutorifechaOrde: string;
  orsCodservicioSebs: string;
  orsServiceventOrde: string;
  orsServiclugarOrde: string;
  orsServicobjetoOrde: string;
  orsPlanfechiniOrde: string;
  orsPlanfechfinOrde: string;
  prvIdentifkeyMprv: string;
  prvIdentifkeyRelg: string;
  orsValorbaseOrde: number | "";
  orsValordeivaOrde: number | "";
  orsValortotalOrde: number | "";
  orsTiporegistOrde: string;
  orsEstadoregOrde: string;
}

interface OrdenServicioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: OrdenServicioDto | null;
  proveedores?: ProveedorDto[];
  serviciosBasicos?: ServicioBasicoDto[];
  onClose: () => void;
  onSubmit: (data: OrdenServicioDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyOrde: "",
  orsAutorifechaOrde: "",
  orsCodservicioSebs: "",
  orsServiceventOrde: "",
  orsServiclugarOrde: "",
  orsServicobjetoOrde: "",
  orsPlanfechiniOrde: "",
  orsPlanfechfinOrde: "",
  prvIdentifkeyMprv: "",
  prvIdentifkeyRelg: "",
  orsValorbaseOrde: "",
  orsValordeivaOrde: "",
  orsValortotalOrde: "",
  orsTiporegistOrde: "1",
  orsEstadoregOrde: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: OrdenServicioDto): FormValues {
  return {
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsAutorifechaOrde: data.orsAutorifechaOrde ?? "",
    orsCodservicioSebs: data.orsCodservicioSebs ?? "",
    orsServiceventOrde: data.orsServiceventOrde ?? "",
    orsServiclugarOrde: data.orsServiclugarOrde ?? "",
    orsServicobjetoOrde: data.orsServicobjetoOrde ?? "",
    orsPlanfechiniOrde: data.orsPlanfechiniOrde ?? "",
    orsPlanfechfinOrde: data.orsPlanfechfinOrde ?? "",
    prvIdentifkeyMprv: data.prvIdentifkeyMprv ?? "",
    prvIdentifkeyRelg: data.prvIdentifkeyRelg ?? "",
    orsValorbaseOrde:
      typeof data.orsValorbaseOrde === "number" ? data.orsValorbaseOrde : "",
    orsValordeivaOrde:
      typeof data.orsValordeivaOrde === "number" ? data.orsValordeivaOrde : "",
    orsValortotalOrde:
      typeof data.orsValortotalOrde === "number"
        ? data.orsValortotalOrde
        : "",
    orsTiporegistOrde: normalizeTipoRegistro(data.orsTiporegistOrde),
    orsEstadoregOrde: normalizeEstadoRegistro(data.orsEstadoregOrde)
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function safeNumber(value: number | "") {
  if (value === "" || Number.isNaN(value)) return 0;

  return Number(value);
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeServiceCode(value: string) {
  return normalizeKey(value).slice(0, 5);
}

function getRecordValue(item: unknown, fieldName: string) {
  if (!item || typeof item !== "object") return undefined;

  const record = item as Record<string, unknown>;
  const value = record[fieldName];

  return typeof value === "string" ? value : undefined;
}

function getProveedorKey(proveedor: ProveedorDto) {
  return getRecordValue(proveedor, "prvIdentifkeyMprv") ?? "";
}

function getProveedorRepresentanteKey(proveedor: ProveedorDto) {
  return getRecordValue(proveedor, "prvIdentifkeyRelg") ?? "";
}

function getProveedorLabel(proveedor: ProveedorDto) {
  const razonSocial = getRecordValue(proveedor, "prvRazonsocialMprv");
  const numeroNit = getRecordValue(proveedor, "prvNumeronitMprv");
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

export function OrdenServicioForm({
  open,
  loading = false,
  initialData,
  proveedores = [],
  serviciosBasicos = [],
  onClose,
  onSubmit
}: OrdenServicioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  const valorBase = watch("orsValorbaseOrde");
  const valorIva = watch("orsValordeivaOrde");
  const proveedorSeleccionadoKey = watch("prvIdentifkeyMprv");

  const hasProveedores = proveedores.length > 0;
  const hasServiciosBasicos = serviciosBasicos.length > 0;

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  useEffect(() => {
    if (!open) return;

    const total = safeNumber(valorBase) + safeNumber(valorIva);

    if (total > 0) {
      setValue("orsValortotalOrde", total, {
        shouldValidate: true,
        shouldDirty: true
      });
      return;
    }

    setValue("orsValortotalOrde", "", {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [open, valorBase, valorIva, setValue]);

  useEffect(() => {
    if (!open || initialData) return;
    if (!proveedorSeleccionadoKey || !hasProveedores) return;

    const proveedorSeleccionado = proveedores.find(
      proveedor => getProveedorKey(proveedor) === proveedorSeleccionadoKey
    );

    const representanteKey = proveedorSeleccionado
      ? getProveedorRepresentanteKey(proveedorSeleccionado)
      : "";

    if (!representanteKey) return;

    setValue("prvIdentifkeyRelg", representanteKey, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [
    open,
    initialData,
    proveedorSeleccionadoKey,
    proveedores,
    hasProveedores,
    setValue
  ]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyOrde: initialData?.orsPrimarykeyOrde,
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsAutorifechaOrde: values.orsAutorifechaOrde || undefined,
      orsCodservicioSebs:
        normalizeServiceCode(values.orsCodservicioSebs) || undefined,
      orsServiceventOrde: values.orsServiceventOrde.trim() || undefined,
      orsServiclugarOrde: values.orsServiclugarOrde.trim() || undefined,
      orsServicobjetoOrde: values.orsServicobjetoOrde.trim() || undefined,
      orsPlanfechiniOrde: values.orsPlanfechiniOrde || undefined,
      orsPlanfechfinOrde: values.orsPlanfechfinOrde || undefined,
      prvIdentifkeyMprv: values.prvIdentifkeyMprv.trim() || undefined,
      prvIdentifkeyRelg: values.prvIdentifkeyRelg.trim() || null,
      orsValorbaseOrde: toOptionalNumber(values.orsValorbaseOrde),
      orsValordeivaOrde: toOptionalNumber(values.orsValordeivaOrde),
      orsValortotalOrde: toOptionalNumber(values.orsValortotalOrde),
      orsTiporegistOrde: normalizeTipoRegistro(values.orsTiporegistOrde),
      orsEstadoregOrde: normalizeEstadoRegistro(
        values.orsEstadoregOrde
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        <Box
          component="div"
          sx={{
            m: 0,
            fontSize: "1.25rem",
            fontWeight: 900
          }}
        >
          {initialData ? "Editar orden de servicio" : "Crear orden de servicio"}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.9rem"
          }}
        >
          Registra la información base contractual y operativa de la orden.
        </Box>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Información de la orden
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código orden"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={
                  errors.orsIdentifkeyOrde?.message ??
                  "Código único de la orden de servicio."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyOrde", {
                  required: "El código de la orden es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código de la orden es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha autorización"
                error={Boolean(errors.orsAutorifechaOrde)}
                helperText={errors.orsAutorifechaOrde?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsAutorifechaOrde", {
                  required: "La fecha de autorización es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              {hasServiciosBasicos ? (
                <Controller
                  name="orsCodservicioSebs"
                  control={control}
                  rules={{
                    required: "El servicio básico es obligatorio",
                    maxLength: {
                      value: 5,
                      message: "El código del servicio no puede superar 5 caracteres"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      select
                      fullWidth
                      label="Servicio básico"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={Boolean(errors.orsCodservicioSebs)}
                      helperText={
                        errors.orsCodservicioSebs?.message ??
                        "Seleccione un servicio básico."
                      }
                    >
                      <MenuItem value="">Seleccione...</MenuItem>

                      {serviciosBasicos.map(servicio => (
                        <MenuItem
                          key={servicio.orsCodservicioSebs}
                          value={servicio.orsCodservicioSebs}
                        >
                          {getServicioBasicoLabel(servicio)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Código servicio"
                  placeholder="SEB01"
                  error={Boolean(errors.orsCodservicioSebs)}
                  helperText={
                    errors.orsCodservicioSebs?.message ??
                    "Máximo 5 caracteres. Ejemplo: SEB01."
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: 5
                    }
                  }}
                  {...register("orsCodservicioSebs", {
                    required: "El código del servicio es obligatorio",
                    maxLength: {
                      value: 5,
                      message: "El código del servicio no puede superar 5 caracteres"
                    },
                    validate: value =>
                      value.trim().length > 0 ||
                      "El código del servicio es obligatorio"
                  })}
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Datos del servicio
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Evento que originó el servicio"
                error={Boolean(errors.orsServiceventOrde)}
                helperText={errors.orsServiceventOrde?.message}
                {...register("orsServiceventOrde", {
                  required: "El evento o servicio es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Lugar de prestación del servicio"
                error={Boolean(errors.orsServiclugarOrde)}
                helperText={errors.orsServiclugarOrde?.message}
                {...register("orsServiclugarOrde", {
                  required: "El lugar del servicio es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Objeto contractual"
                error={Boolean(errors.orsServicobjetoOrde)}
                helperText={errors.orsServicobjetoOrde?.message}
                {...register("orsServicobjetoOrde", {
                  required: "El objeto de la orden es obligatorio",
                  minLength: {
                    value: 10,
                    message: "El objeto debe tener mínimo 10 caracteres"
                  }
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Programación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio plan"
                error={Boolean(errors.orsPlanfechiniOrde)}
                helperText={errors.orsPlanfechiniOrde?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsPlanfechiniOrde", {
                  required: "La fecha de inicio del plan es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha fin plan"
                error={Boolean(errors.orsPlanfechfinOrde)}
                helperText={errors.orsPlanfechfinOrde?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsPlanfechfinOrde", {
                  required: "La fecha de fin del plan es obligatoria",
                  validate: value => {
                    const fechaInicio = getValues("orsPlanfechiniOrde");

                    if (!fechaInicio || !value) return true;

                    return (
                      value >= fechaInicio ||
                      "La fecha fin no puede ser menor a la fecha inicio"
                    );
                  }
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Proveedor
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              {hasProveedores ? (
                <Controller
                  name="prvIdentifkeyMprv"
                  control={control}
                  rules={{
                    required: "El proveedor es obligatorio"
                  }}
                  render={({ field }) => (
                    <TextField
                      select
                      fullWidth
                      label="Proveedor"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={Boolean(errors.prvIdentifkeyMprv)}
                      helperText={
                        errors.prvIdentifkeyMprv?.message ??
                        "Seleccione el proveedor autorizado para la orden."
                      }
                    >
                      <MenuItem value="">Seleccione...</MenuItem>

                      {proveedores.map(proveedor => {
                        const proveedorKey = getProveedorKey(proveedor);

                        return (
                          <MenuItem key={proveedorKey} value={proveedorKey}>
                            {getProveedorLabel(proveedor)}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  )}
                />
              ) : (
                <TextField
                  fullWidth
                  label="Proveedor"
                  placeholder="PRV-0001"
                  error={Boolean(errors.prvIdentifkeyMprv)}
                  helperText={
                    errors.prvIdentifkeyMprv?.message ??
                    "Código del proveedor principal."
                  }
                  {...register("prvIdentifkeyMprv", {
                    required: "El proveedor es obligatorio"
                  })}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Representante legal"
                placeholder="Opcional"
                helperText="Se puede completar automáticamente desde el proveedor."
                {...register("prvIdentifkeyRelg")}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Valores de la orden
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor base"
                error={Boolean(errors.orsValorbaseOrde)}
                helperText={errors.orsValorbaseOrde?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorbaseOrde", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor base no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor IVA"
                error={Boolean(errors.orsValordeivaOrde)}
                helperText={errors.orsValordeivaOrde?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValordeivaOrde", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor IVA no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                helperText="Se calcula automáticamente: valor base + IVA."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValortotalOrde", {
                  valueAsNumber: true
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsTiporegistOrde"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Tipo registro interno"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Principal</MenuItem>
                    <MenuItem value="2">Ajuste</MenuItem>
                    <MenuItem value="3">Histórico</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsEstadoregOrde"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="2">Inactivo</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar orden"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}