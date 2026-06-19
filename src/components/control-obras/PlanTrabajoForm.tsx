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

import { PlanTrabajoDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPltr: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPunt: string;
  orsDesactividadPltr: string;
  orsIdentifkeyRseq: string;
  prvIdentifkeyInve: string;
  orsCantidunidadRseq: number | "";
  orsValorunidadRseq: number | "";
  orsValortotalRseq: number | "";
  orsTiporegistPltr: string;
  orsEstadoregPltr: string;
}

interface PlanTrabajoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanTrabajoDto | null;
  onClose: () => void;
  onSubmit: (data: PlanTrabajoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPltr: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPunt: "",
  orsDesactividadPltr: "",
  orsIdentifkeyRseq: "",
  prvIdentifkeyInve: "",
  orsCantidunidadRseq: "",
  orsValorunidadRseq: "",
  orsValortotalRseq: "",
  orsTiporegistPltr: "1",
  orsEstadoregPltr: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: PlanTrabajoDto): FormValues {
  return {
    orsIdentifkeyPltr: data.orsIdentifkeyPltr ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",
    orsDesactividadPltr: data.orsDesactividadPltr ?? "",
    orsIdentifkeyRseq: data.orsIdentifkeyRseq ?? "",
    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    orsCantidunidadRseq:
      typeof data.orsCantidunidadRseq === "number"
        ? data.orsCantidunidadRseq
        : "",
    orsValorunidadRseq:
      typeof data.orsValorunidadRseq === "number"
        ? data.orsValorunidadRseq
        : "",
    orsValortotalRseq:
      typeof data.orsValortotalRseq === "number"
        ? data.orsValortotalRseq
        : "",
    orsTiporegistPltr: normalizeTipoRegistro(data.orsTiporegistPltr),
    orsEstadoregPltr: normalizeEstadoRegistro(data.orsEstadoregPltr)
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

function normalizeText(value: string) {
  return value.trim();
}

export function PlanTrabajoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: PlanTrabajoFormProps) {
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

  const cantidad = watch("orsCantidunidadRseq");
  const valorUnidad = watch("orsValorunidadRseq");

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

    const total = safeNumber(cantidad) * safeNumber(valorUnidad);

    if (total > 0) {
      setValue("orsValortotalRseq", total, {
        shouldValidate: true,
        shouldDirty: true
      });
      return;
    }

    setValue("orsValortotalRseq", "", {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [open, cantidad, valorUnidad, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyPltr: initialData?.orsPrimarykeyPltr,
      orsIdentifkeyPltr: normalizeKey(values.orsIdentifkeyPltr),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPunt: normalizeKey(values.orsIdentifkeyPunt),
      orsDesactividadPltr: normalizeText(values.orsDesactividadPltr),
      orsIdentifkeyRseq: normalizeKey(values.orsIdentifkeyRseq) || undefined,
      prvIdentifkeyInve: normalizeKey(values.prvIdentifkeyInve) || undefined,
      orsCantidunidadRseq: toOptionalNumber(values.orsCantidunidadRseq),
      orsValorunidadRseq: toOptionalNumber(values.orsValorunidadRseq),
      orsValortotalRseq: toOptionalNumber(values.orsValortotalRseq),
      orsTiporegistPltr: normalizeTipoRegistro(values.orsTiporegistPltr),
      orsEstadoregPltr: normalizeEstadoRegistro(
        values.orsEstadoregPltr
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
          {initialData ? "Editar plan de trabajo" : "Crear plan de trabajo"}
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
          Registra la actividad proyectada por orden de servicio y sitio de
          trabajo.
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código plan"
                placeholder="PLTR-0001"
                error={Boolean(errors.orsIdentifkeyPltr)}
                helperText={
                  errors.orsIdentifkeyPltr?.message ??
                  "Código único del plan de trabajo."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyPltr", {
                  required: "El código del plan es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del plan es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Sitio / punto"
                placeholder="PUNT-0001"
                error={Boolean(errors.orsIdentifkeyPunt)}
                helperText={
                  errors.orsIdentifkeyPunt?.message ??
                  "Código del sitio o punto de trabajo."
                }
                {...register("orsIdentifkeyPunt", {
                  required: "El sitio o punto es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El sitio o punto es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Actividad proyectada"
                placeholder="Describe la actividad planeada para este frente o punto de trabajo"
                error={Boolean(errors.orsDesactividadPltr)}
                helperText={errors.orsDesactividadPltr?.message}
                {...register("orsDesactividadPltr", {
                  required: "La actividad proyectada es obligatoria",
                  minLength: {
                    value: 10,
                    message: "La actividad debe tener mínimo 10 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "La actividad proyectada es obligatoria"
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
            Equipo, cantidad y valor
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Resumen equipo"
                placeholder="RSEQ-0001"
                helperText="Opcional. Relación con resumen de equipo de la orden."
                {...register("orsIdentifkeyRseq")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Equipo / inventario"
                placeholder="INVE-0001"
                helperText="Opcional. Código del equipo o inventario asociado."
                {...register("prvIdentifkeyInve")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad"
                error={Boolean(errors.orsCantidunidadRseq)}
                helperText={errors.orsCantidunidadRseq?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsCantidunidadRseq", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad no puede ser negativa"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                error={Boolean(errors.orsValorunidadRseq)}
                helperText={errors.orsValorunidadRseq?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorunidadRseq", {
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
                label="Valor total"
                helperText="Se calcula automáticamente: cantidad x valor unidad."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValortotalRseq", {
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
                name="orsTiporegistPltr"
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
                name="orsEstadoregPltr"
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
            {loading ? "Guardando..." : "Guardar plan"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}