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

import { InformeSemanalDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyInse: string;

  orsIdentifkeyOrde: string;
  orsIdentifkeyPsem: string;
  orsIdentifkeyPlse: string;

  orsFechainicioInse: string;
  orsFechafinInse: string;
  orsDescripcionInse: string;
  orsObservacionInse: string;

  orsAvanceprogramadoInse: number | "";
  orsAvanceejecutadoInse: number | "";
  orsPorccumplimientoInse: number | "";

  orsTiporegistInse: string;
  orsEstadoregInse: string;
}

interface InformeSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: InformeSemanalDto | null;
  onClose: () => void;
  onSubmit: (data: InformeSemanalDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyInse: "",

  orsIdentifkeyOrde: "",
  orsIdentifkeyPsem: "",
  orsIdentifkeyPlse: "",

  orsFechainicioInse: "",
  orsFechafinInse: "",
  orsDescripcionInse: "",
  orsObservacionInse: "",

  orsAvanceprogramadoInse: "",
  orsAvanceejecutadoInse: "",
  orsPorccumplimientoInse: "",

  orsTiporegistInse: "1",
  orsEstadoregInse: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: InformeSemanalDto): FormValues {
  return {
    orsIdentifkeyInse: data.orsIdentifkeyInse ?? "",

    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",

    orsFechainicioInse: data.orsFechainicioInse ?? "",
    orsFechafinInse: data.orsFechafinInse ?? "",
    orsDescripcionInse: data.orsDescripcionInse ?? "",
    orsObservacionInse: data.orsObservacionInse ?? "",

    orsAvanceprogramadoInse:
      typeof data.orsAvanceprogramadoInse === "number"
        ? data.orsAvanceprogramadoInse
        : "",
    orsAvanceejecutadoInse:
      typeof data.orsAvanceejecutadoInse === "number"
        ? data.orsAvanceejecutadoInse
        : "",
    orsPorccumplimientoInse:
      typeof data.orsPorccumplimientoInse === "number"
        ? data.orsPorccumplimientoInse
        : "",

    orsTiporegistInse: normalizeTipoRegistro(data.orsTiporegistInse),
    orsEstadoregInse: normalizeEstadoRegistro(data.orsEstadoregInse)
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function calculateCompliance(programado: number | "", ejecutado: number | "") {
  const planned = toOptionalNumber(programado) ?? 0;
  const executed = toOptionalNumber(ejecutado) ?? 0;

  if (planned <= 0) return 0;

  return Number(((executed / planned) * 100).toFixed(2));
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

export function InformeSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: InformeSemanalFormProps) {
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

  const avanceProgramado = watch("orsAvanceprogramadoInse");
  const avanceEjecutado = watch("orsAvanceejecutadoInse");

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

    const compliance = calculateCompliance(avanceProgramado, avanceEjecutado);

    setValue("orsPorccumplimientoInse", compliance, {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [open, avanceProgramado, avanceEjecutado, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyInse: initialData?.orsPrimarykeyInse,
      orsIdentifkeyInse: normalizeKey(values.orsIdentifkeyInse),

      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPsem: normalizeKey(values.orsIdentifkeyPsem) || undefined,
      orsIdentifkeyPlse: normalizeKey(values.orsIdentifkeyPlse) || undefined,

      orsFechainicioInse: values.orsFechainicioInse || undefined,
      orsFechafinInse: values.orsFechafinInse || undefined,
      orsDescripcionInse: normalizeText(values.orsDescripcionInse) || undefined,
      orsObservacionInse: normalizeText(values.orsObservacionInse) || undefined,

      orsAvanceprogramadoInse: toOptionalNumber(
        values.orsAvanceprogramadoInse
      ),
      orsAvanceejecutadoInse: toOptionalNumber(values.orsAvanceejecutadoInse),
      orsPorccumplimientoInse: toOptionalNumber(
        values.orsPorccumplimientoInse
      ),

      orsTiporegistInse: normalizeTipoRegistro(values.orsTiporegistInse),
      orsEstadoregInse: normalizeEstadoRegistro(
        values.orsEstadoregInse
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
          {initialData ? "Editar informe semanal" : "Crear informe semanal"}
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
          Consolida el avance semanal programado contra ejecutado para una orden
          de servicio.
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
                label="Código informe"
                placeholder="INSE-0001"
                error={Boolean(errors.orsIdentifkeyInse)}
                helperText={
                  errors.orsIdentifkeyInse?.message ??
                  "Código único del informe semanal."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyInse", {
                  required: "El código del informe es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del informe es obligatorio"
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
                  "Código de la orden asociada."
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
                label="Proyección semanal"
                placeholder="PSEM-0001"
                helperText="Opcional. Semana proyectada relacionada."
                {...register("orsIdentifkeyPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan semanal"
                placeholder="PLSE-0001"
                helperText="Opcional. Plan semanal relacionado."
                {...register("orsIdentifkeyPlse")}
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
            Periodo del informe
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio"
                error={Boolean(errors.orsFechainicioInse)}
                helperText={errors.orsFechainicioInse?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioInse", {
                  required: "La fecha de inicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha fin"
                error={Boolean(errors.orsFechafinInse)}
                helperText={errors.orsFechafinInse?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinInse", {
                  required: "La fecha fin es obligatoria",
                  validate: value => {
                    const fechaInicio = getValues("orsFechainicioInse");

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
            Avance semanal
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Avance programado"
                error={Boolean(errors.orsAvanceprogramadoInse)}
                helperText={errors.orsAvanceprogramadoInse?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsAvanceprogramadoInse", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El avance programado no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Avance ejecutado"
                error={Boolean(errors.orsAvanceejecutadoInse)}
                helperText={errors.orsAvanceejecutadoInse?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsAvanceejecutadoInse", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El avance ejecutado no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="% cumplimiento"
                helperText="Se calcula automáticamente: ejecutado / programado x 100."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsPorccumplimientoInse", {
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
            Descripción y observaciones
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                minRows={3}
                placeholder="Describe el resumen del avance semanal."
                error={Boolean(errors.orsDescripcionInse)}
                helperText={errors.orsDescripcionInse?.message}
                {...register("orsDescripcionInse", {
                  minLength: {
                    value: 5,
                    message: "La descripción debe tener mínimo 5 caracteres"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Observación"
                multiline
                minRows={3}
                placeholder="Registra restricciones, pendientes, novedades o comentarios del periodo."
                error={Boolean(errors.orsObservacionInse)}
                helperText={errors.orsObservacionInse?.message}
                {...register("orsObservacionInse", {
                  minLength: {
                    value: 5,
                    message: "La observación debe tener mínimo 5 caracteres"
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
            Control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsTiporegistInse"
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
                name="orsEstadoregInse"
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
            {loading ? "Guardando..." : "Guardar informe"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}