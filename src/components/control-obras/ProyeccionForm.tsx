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

import { ProyeccionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPsem: string;
  orsIdentifkeyOrde: string;
  orsNumsemanaPsem: number | "";
  orsFechainicioPsem: string;
  orsFechafinPsem: string;
  orsDescripcionPsem: string;
  orsTiporegistPsem: string;
  orsEstadoregPsem: string;
}

interface ProyeccionSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ProyeccionDto | null;
  onClose: () => void;
  onSubmit: (data: ProyeccionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPsem: "",
  orsIdentifkeyOrde: "",
  orsNumsemanaPsem: "",
  orsFechainicioPsem: "",
  orsFechafinPsem: "",
  orsDescripcionPsem: "",
  orsTiporegistPsem: "1",
  orsEstadoregPsem: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: ProyeccionDto): FormValues {
  return {
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsNumsemanaPsem:
      typeof data.orsNumsemanaPsem === "number" ? data.orsNumsemanaPsem : "",
    orsFechainicioPsem: data.orsFechainicioPsem ?? "",
    orsFechafinPsem: data.orsFechafinPsem ?? "",
    orsDescripcionPsem: data.orsDescripcionPsem ?? "",
    orsTiporegistPsem: normalizeTipoRegistro(data.orsTiporegistPsem),
    orsEstadoregPsem: normalizeEstadoRegistro(data.orsEstadoregPsem)
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

export function ProyeccionSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ProyeccionSemanalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyPsem: initialData?.orsPrimarykeyPsem,
      orsIdentifkeyPsem: normalizeKey(values.orsIdentifkeyPsem),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsNumsemanaPsem: toOptionalNumber(values.orsNumsemanaPsem),
      orsFechainicioPsem: values.orsFechainicioPsem || undefined,
      orsFechafinPsem: values.orsFechafinPsem || undefined,
      orsDescripcionPsem: normalizeText(values.orsDescripcionPsem) || undefined,
      orsTiporegistPsem: normalizeTipoRegistro(values.orsTiporegistPsem),
      orsEstadoregPsem: normalizeEstadoRegistro(
        values.orsEstadoregPsem
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
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
          {initialData
            ? "Editar proyección semanal"
            : "Crear proyección semanal"}
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
          Registra la semana proyectada de ejecución asociada a una orden de
          servicio.
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
                label="Código proyección"
                placeholder="PSEM-0001"
                error={Boolean(errors.orsIdentifkeyPsem)}
                helperText={
                  errors.orsIdentifkeyPsem?.message ??
                  "Código único de la proyección semanal."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyPsem", {
                  required: "El código de la proyección es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código de la proyección es obligatorio"
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Número semana"
                error={Boolean(errors.orsNumsemanaPsem)}
                helperText={errors.orsNumsemanaPsem?.message}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 1
                  }
                }}
                {...register("orsNumsemanaPsem", {
                  valueAsNumber: true,
                  required: "El número de semana es obligatorio",
                  min: {
                    value: 1,
                    message: "El número de semana debe ser mayor o igual a 1"
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
            Fechas y descripción
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio"
                error={Boolean(errors.orsFechainicioPsem)}
                helperText={errors.orsFechainicioPsem?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioPsem", {
                  required: "La fecha de inicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha fin"
                error={Boolean(errors.orsFechafinPsem)}
                helperText={errors.orsFechafinPsem?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinPsem", {
                  required: "La fecha fin es obligatoria",
                  validate: value => {
                    const fechaInicio = getValues("orsFechainicioPsem");

                    if (!fechaInicio || !value) return true;

                    return (
                      value >= fechaInicio ||
                      "La fecha fin no puede ser menor a la fecha inicio"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Describe el alcance de la semana proyectada"
                error={Boolean(errors.orsDescripcionPsem)}
                helperText={errors.orsDescripcionPsem?.message}
                {...register("orsDescripcionPsem", {
                  minLength: {
                    value: 5,
                    message: "La descripción debe tener mínimo 5 caracteres"
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
                name="orsTiporegistPsem"
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
                name="orsEstadoregPsem"
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
            {loading ? "Guardando..." : "Guardar proyección"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}