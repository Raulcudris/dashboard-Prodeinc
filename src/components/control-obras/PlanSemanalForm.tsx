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

import { PlanSemanalDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPlse: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPltr: string;
  orsIdentifkeyPsem: string;
  orsCantidunidadPlse: number | "";
  orsValorunidadPlse: number | "";
  orsValortotalPlse: number | "";
  orsEjecutunidadPlse: number | "";
  orsValorejecutPlse: number | "";
  orsTiporegistPlse: string;
  orsEstadoregPlse: string;
}

interface PlanSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanSemanalDto | null;
  onClose: () => void;
  onSubmit: (data: PlanSemanalDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPlse: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPltr: "",
  orsIdentifkeyPsem: "",
  orsCantidunidadPlse: "",
  orsValorunidadPlse: "",
  orsValortotalPlse: "",
  orsEjecutunidadPlse: "",
  orsValorejecutPlse: "",
  orsTiporegistPlse: "1",
  orsEstadoregPlse: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: PlanSemanalDto): FormValues {
  return {
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPltr: data.orsIdentifkeyPltr ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsCantidunidadPlse:
      typeof data.orsCantidunidadPlse === "number"
        ? data.orsCantidunidadPlse
        : "",
    orsValorunidadPlse:
      typeof data.orsValorunidadPlse === "number"
        ? data.orsValorunidadPlse
        : "",
    orsValortotalPlse:
      typeof data.orsValortotalPlse === "number"
        ? data.orsValortotalPlse
        : "",
    orsEjecutunidadPlse:
      typeof data.orsEjecutunidadPlse === "number"
        ? data.orsEjecutunidadPlse
        : "",
    orsValorejecutPlse:
      typeof data.orsValorejecutPlse === "number"
        ? data.orsValorejecutPlse
        : "",
    orsTiporegistPlse: normalizeTipoRegistro(data.orsTiporegistPlse),
    orsEstadoregPlse: normalizeEstadoRegistro(data.orsEstadoregPlse)
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

export function PlanSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: PlanSemanalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  const cantidadProgramada = watch("orsCantidunidadPlse");
  const valorUnidad = watch("orsValorunidadPlse");
  const cantidadEjecutada = watch("orsEjecutunidadPlse");

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

    const totalProgramado =
      safeNumber(cantidadProgramada) * safeNumber(valorUnidad);

    if (totalProgramado > 0) {
      setValue("orsValortotalPlse", totalProgramado, {
        shouldValidate: true,
        shouldDirty: true
      });
    } else {
      setValue("orsValortotalPlse", "", {
        shouldValidate: true,
        shouldDirty: true
      });
    }

    const totalEjecutado =
      safeNumber(cantidadEjecutada) * safeNumber(valorUnidad);

    if (totalEjecutado > 0) {
      setValue("orsValorejecutPlse", totalEjecutado, {
        shouldValidate: true,
        shouldDirty: true
      });
    } else {
      setValue("orsValorejecutPlse", "", {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [open, cantidadProgramada, cantidadEjecutada, valorUnidad, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyPlse: initialData?.orsPrimarykeyPlse,
      orsIdentifkeyPlse: normalizeKey(values.orsIdentifkeyPlse),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPltr: normalizeKey(values.orsIdentifkeyPltr),
      orsIdentifkeyPsem: normalizeKey(values.orsIdentifkeyPsem),
      orsCantidunidadPlse: toOptionalNumber(values.orsCantidunidadPlse),
      orsValorunidadPlse: toOptionalNumber(values.orsValorunidadPlse),
      orsValortotalPlse: toOptionalNumber(values.orsValortotalPlse),
      orsEjecutunidadPlse: toOptionalNumber(values.orsEjecutunidadPlse),
      orsValorejecutPlse: toOptionalNumber(values.orsValorejecutPlse),
      orsTiporegistPlse: normalizeTipoRegistro(values.orsTiporegistPlse),
      orsEstadoregPlse: normalizeEstadoRegistro(
        values.orsEstadoregPlse
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
          {initialData ? "Editar plan semanal" : "Crear plan semanal"}
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
          Registra la programación semanal asociada a una orden, plan de trabajo
          y proyección semanal.
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
            Información principal
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código plan semanal"
                placeholder="PLSE-0001"
                error={Boolean(errors.orsIdentifkeyPlse)}
                helperText={
                  errors.orsIdentifkeyPlse?.message ??
                  "Código único del plan semanal."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyPlse", {
                  required: "El código del plan semanal es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del plan semanal es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={
                  errors.orsIdentifkeyOrde?.message ??
                  "Código de la orden de servicio."
                }
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan de trabajo"
                placeholder="PLTR-0001"
                error={Boolean(errors.orsIdentifkeyPltr)}
                helperText={
                  errors.orsIdentifkeyPltr?.message ??
                  "Código del plan de trabajo proyectado."
                }
                {...register("orsIdentifkeyPltr", {
                  required: "El plan de trabajo es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El plan de trabajo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Proyección semanal"
                placeholder="PSEM-0001"
                error={Boolean(errors.orsIdentifkeyPsem)}
                helperText={
                  errors.orsIdentifkeyPsem?.message ??
                  "Código de la semana proyectada."
                }
                {...register("orsIdentifkeyPsem", {
                  required: "La proyección semanal es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La proyección semanal es obligatoria"
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
            Programación semanal
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad programada"
                error={Boolean(errors.orsCantidunidadPlse)}
                helperText={errors.orsCantidunidadPlse?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsCantidunidadPlse", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad programada no puede ser negativa"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                error={Boolean(errors.orsValorunidadPlse)}
                helperText={errors.orsValorunidadPlse?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorunidadPlse", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor unidad no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total programado"
                helperText="Se calcula automáticamente: cantidad programada x valor unidad."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValortotalPlse", {
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
            Ejecución acumulada
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad ejecutada"
                error={Boolean(errors.orsEjecutunidadPlse)}
                helperText={
                  errors.orsEjecutunidadPlse?.message ??
                  "Puede quedar en cero si aún no hay ejecución."
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsEjecutunidadPlse", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad ejecutada no puede ser negativa"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor ejecutado"
                helperText="Se calcula automáticamente: cantidad ejecutada x valor unidad."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorejecutPlse", {
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
                name="orsTiporegistPlse"
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
                name="orsEstadoregPlse"
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
            {loading ? "Guardando..." : "Guardar plan semanal"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}