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

import { ReporteOperacionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyRope: string;
  orsIdentifkeyOrde: string;
  orsFechareportRope: string;
  orsObservacionRope: string;
  orsTiporegistRope: string;
  orsEstadoregRope: string;
}

interface ReporteOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteOperacionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  orsFechareportRope: "",
  orsObservacionRope: "",
  orsTiporegistRope: "1",
  orsEstadoregRope: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: ReporteOperacionDto): FormValues {
  return {
    orsIdentifkeyRope: data.orsIdentifkeyRope ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsFechareportRope: data.orsFechareportRope ?? "",
    orsObservacionRope: data.orsObservacionRope ?? "",
    orsTiporegistRope: normalizeTipoRegistro(data.orsTiporegistRope),
    orsEstadoregRope: normalizeEstadoRegistro(data.orsEstadoregRope)
  };
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

export function ReporteOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ReporteOperacionFormProps) {
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
      orsPrimarykeyRope: initialData?.orsPrimarykeyRope,
      orsIdentifkeyRope: normalizeKey(values.orsIdentifkeyRope),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsFechareportRope: values.orsFechareportRope || undefined,
      orsObservacionRope:
        normalizeText(values.orsObservacionRope) || undefined,
      orsTiporegistRope: normalizeTipoRegistro(values.orsTiporegistRope),
      orsEstadoregRope: normalizeEstadoRegistro(
        values.orsEstadoregRope
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
            ? "Editar reporte de operación"
            : "Crear reporte de operación"}
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
          Registra el encabezado operativo diario para relacionar maquinaria,
          equipos y detalles de operación.
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
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Código reporte"
                placeholder="ROPE-0001"
                error={Boolean(errors.orsIdentifkeyRope)}
                helperText={
                  errors.orsIdentifkeyRope?.message ??
                  "Código único del reporte de operación."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyRope", {
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

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={
                  errors.orsIdentifkeyOrde?.message ??
                  "Código de la orden de servicio asociada."
                }
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha reporte"
                error={Boolean(errors.orsFechareportRope)}
                helperText={errors.orsFechareportRope?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechareportRope", {
                  required: "La fecha del reporte es obligatoria"
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
            Observación operacional
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Observación"
                placeholder="Describe condiciones de operación, disponibilidad de equipos, restricciones, novedades o comentarios relevantes."
                error={Boolean(errors.orsObservacionRope)}
                helperText={errors.orsObservacionRope?.message}
                {...register("orsObservacionRope", {
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
                name="orsTiporegistRope"
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
                name="orsEstadoregRope"
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