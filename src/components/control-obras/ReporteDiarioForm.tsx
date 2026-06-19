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

import { ReporteDiarioDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPdia: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPsem: string;
  orsObservacionPdia: string;
  orsFechareportPdia: string;
  orsEjecutunidadPdia: number | "";
  orsTiporegistPdia: string;
  orsEstadoregPdia: string;
}

interface ReporteDiarioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteDiarioDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteDiarioDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPdia: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPsem: "",
  orsObservacionPdia: "",
  orsFechareportPdia: "",
  orsEjecutunidadPdia: "",
  orsTiporegistPdia: "1",
  orsEstadoregPdia: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: ReporteDiarioDto): FormValues {
  return {
    orsIdentifkeyPdia: data.orsIdentifkeyPdia ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsObservacionPdia: data.orsObservacionPdia ?? "",
    orsFechareportPdia: data.orsFechareportPdia ?? "",
    orsEjecutunidadPdia:
      typeof data.orsEjecutunidadPdia === "number"
        ? data.orsEjecutunidadPdia
        : "",
    orsTiporegistPdia: normalizeTipoRegistro(data.orsTiporegistPdia),
    orsEstadoregPdia: normalizeEstadoRegistro(data.orsEstadoregPdia)
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

export function ReporteDiarioForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ReporteDiarioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
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
      orsPrimarykeyPdia: initialData?.orsPrimarykeyPdia,
      orsIdentifkeyPdia: normalizeKey(values.orsIdentifkeyPdia),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPlse: normalizeKey(values.orsIdentifkeyPlse),
      orsIdentifkeyPsem: normalizeKey(values.orsIdentifkeyPsem) || undefined,
      orsObservacionPdia:
        normalizeText(values.orsObservacionPdia) || undefined,
      orsFechareportPdia: values.orsFechareportPdia || undefined,
      orsEjecutunidadPdia: toOptionalNumber(values.orsEjecutunidadPdia),
      orsTiporegistPdia: normalizeTipoRegistro(values.orsTiporegistPdia),
      orsEstadoregPdia: normalizeEstadoRegistro(
        values.orsEstadoregPdia
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
          {initialData ? "Editar reporte diario" : "Crear reporte diario"}
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
          Registra el avance ejecutado, observaciones y relación con el plan
          semanal.
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
                label="Código reporte diario"
                placeholder="PDIA-0001"
                error={Boolean(errors.orsIdentifkeyPdia)}
                helperText={
                  errors.orsIdentifkeyPdia?.message ??
                  "Código único del reporte diario."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyPdia", {
                  required: "El código del reporte es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del reporte es obligatorio"
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
                label="Plan semanal"
                placeholder="PLSE-0001"
                error={Boolean(errors.orsIdentifkeyPlse)}
                helperText={
                  errors.orsIdentifkeyPlse?.message ??
                  "Código del plan semanal ejecutado."
                }
                {...register("orsIdentifkeyPlse", {
                  required: "El plan semanal es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El plan semanal es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Proyección semanal"
                placeholder="PSEM-0001"
                helperText="Opcional. Relación con la semana proyectada."
                {...register("orsIdentifkeyPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha reporte"
                error={Boolean(errors.orsFechareportPdia)}
                helperText={errors.orsFechareportPdia?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechareportPdia", {
                  required: "La fecha del reporte es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad ejecutada"
                error={Boolean(errors.orsEjecutunidadPdia)}
                helperText={
                  errors.orsEjecutunidadPdia?.message ??
                  "Cantidad ejecutada en este reporte diario."
                }
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsEjecutunidadPdia", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad ejecutada no puede ser negativa"
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
            Observación de campo
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Observación"
                placeholder="Describe avances, condiciones de obra, restricciones, personal, equipos o novedades relevantes."
                error={Boolean(errors.orsObservacionPdia)}
                helperText={errors.orsObservacionPdia?.message}
                {...register("orsObservacionPdia", {
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
                name="orsTiporegistPdia"
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
                name="orsEstadoregPdia"
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
            {loading ? "Guardando..." : "Guardar reporte"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}