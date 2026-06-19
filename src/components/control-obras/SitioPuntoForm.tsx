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

import { SitioPuntoDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPunt: string;
  orsIdentifkeyOrde: string;
  orsNombresitioPunt: string;
  sisCodproSipr: string;
  orsGeolatitudePunt: number | "";
  orsGeolongitudePunt: number | "";
  orsPathimagenPunt: string;
  orsTiporegistPunt: string;
  orsEstadoregPunt: string;
}

interface SitioPuntoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: SitioPuntoDto | null;
  onClose: () => void;
  onSubmit: (data: SitioPuntoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPunt: "",
  orsIdentifkeyOrde: "",
  orsNombresitioPunt: "",
  sisCodproSipr: "",
  orsGeolatitudePunt: "",
  orsGeolongitudePunt: "",
  orsPathimagenPunt: "",
  orsTiporegistPunt: "1",
  orsEstadoregPunt: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: SitioPuntoDto): FormValues {
  return {
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsNombresitioPunt: data.orsNombresitioPunt ?? "",
    sisCodproSipr: data.sisCodproSipr ?? "",
    orsGeolatitudePunt:
      typeof data.orsGeolatitudePunt === "number"
        ? data.orsGeolatitudePunt
        : data.orsGeolatitudePunt
          ? Number(data.orsGeolatitudePunt)
          : "",
    orsGeolongitudePunt:
      typeof data.orsGeolongitudePunt === "number"
        ? data.orsGeolongitudePunt
        : data.orsGeolongitudePunt
          ? Number(data.orsGeolongitudePunt)
          : "",
    orsPathimagenPunt: data.orsPathimagenPunt ?? "",
    orsTiporegistPunt: normalizeTipoRegistro(data.orsTiporegistPunt),
    orsEstadoregPunt: normalizeEstadoRegistro(data.orsEstadoregPunt)
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

export function SitioPuntoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: SitioPuntoFormProps) {
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
      orsPrimarykeyPunt: initialData?.orsPrimarykeyPunt,
      orsIdentifkeyPunt: normalizeKey(values.orsIdentifkeyPunt),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsNombresitioPunt: normalizeText(values.orsNombresitioPunt),
      sisCodproSipr: normalizeKey(values.sisCodproSipr) || undefined,
      orsGeolatitudePunt: toOptionalNumber(values.orsGeolatitudePunt),
      orsGeolongitudePunt: toOptionalNumber(values.orsGeolongitudePunt),
      orsPathimagenPunt: normalizeText(values.orsPathimagenPunt) || undefined,
      orsTiporegistPunt: normalizeTipoRegistro(values.orsTiporegistPunt),
      orsEstadoregPunt: normalizeEstadoRegistro(
        values.orsEstadoregPunt
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
          {initialData ? "Editar sitio o punto" : "Crear sitio o punto"}
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
          Registra el frente, punto o sitio de ejecución asociado a una orden de
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
                label="Código sitio"
                placeholder="PUNT-0001"
                error={Boolean(errors.orsIdentifkeyPunt)}
                helperText={
                  errors.orsIdentifkeyPunt?.message ??
                  "Código único del sitio o punto."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyPunt", {
                  required: "El código del sitio es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del sitio es obligatorio"
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
                  "Código de la orden a la que pertenece el sitio."
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
                label="Código proyecto"
                placeholder="PROY-0001"
                helperText="Opcional. Código interno del proyecto."
                {...register("sisCodproSipr")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre del sitio"
                placeholder="Ejemplo: Frente norte, tramo 1, punto inicial"
                error={Boolean(errors.orsNombresitioPunt)}
                helperText={errors.orsNombresitioPunt?.message}
                {...register("orsNombresitioPunt", {
                  required: "El nombre del sitio es obligatorio",
                  minLength: {
                    value: 4,
                    message: "El nombre del sitio debe tener mínimo 4 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El nombre del sitio es obligatorio"
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
            Ubicación y soporte visual
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitud"
                placeholder="Ejemplo: 4.7110"
                error={Boolean(errors.orsGeolatitudePunt)}
                helperText={
                  errors.orsGeolatitudePunt?.message ??
                  "Opcional. Debe estar entre -90 y 90."
                }
                slotProps={{
                  htmlInput: {
                    min: -90,
                    max: 90,
                    step: "0.000001"
                  }
                }}
                {...register("orsGeolatitudePunt", {
                  valueAsNumber: true,
                  validate: value => {
                    if (value === "" || Number.isNaN(value)) return true;

                    const numberValue = Number(value);

                    if (numberValue < -90 || numberValue > 90) {
                      return "La latitud debe estar entre -90 y 90";
                    }

                    return true;
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitud"
                placeholder="Ejemplo: -74.0721"
                error={Boolean(errors.orsGeolongitudePunt)}
                helperText={
                  errors.orsGeolongitudePunt?.message ??
                  "Opcional. Debe estar entre -180 y 180."
                }
                slotProps={{
                  htmlInput: {
                    min: -180,
                    max: 180,
                    step: "0.000001"
                  }
                }}
                {...register("orsGeolongitudePunt", {
                  valueAsNumber: true,
                  validate: value => {
                    if (value === "" || Number.isNaN(value)) return true;

                    const numberValue = Number(value);

                    if (numberValue < -180 || numberValue > 180) {
                      return "La longitud debe estar entre -180 y 180";
                    }

                    return true;
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Ruta imagen / evidencia"
                placeholder="URL o ruta del archivo"
                helperText="Opcional. Puedes relacionar una imagen general del sitio."
                {...register("orsPathimagenPunt")}
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
                name="orsTiporegistPunt"
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
                name="orsEstadoregPunt"
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
            {loading ? "Guardando..." : "Guardar sitio"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}