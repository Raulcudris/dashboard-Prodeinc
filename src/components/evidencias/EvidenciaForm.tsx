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

import { EvidenciaDto } from "../../types/evidencias.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  eviIdentifkeyEvid: string;
  eviIdentifkeyTiev: string;
  eviNombrearchivoEvid: string;
  eviDescripcionEvid: string;
  eviUrlarchivoEvid: string;
  eviFechacapturaEvid: string;
  eviLatitudEvid: number | "";
  eviLongitudEvid: number | "";
  eviTiporegistEvid: string;
  eviEstadoregEvid: string;
}

interface EvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EvidenciaDto | null;
  onClose: () => void;
  onSubmit: (data: EvidenciaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  eviIdentifkeyEvid: "",
  eviIdentifkeyTiev: "",
  eviNombrearchivoEvid: "",
  eviDescripcionEvid: "",
  eviUrlarchivoEvid: "",
  eviFechacapturaEvid: "",
  eviLatitudEvid: "",
  eviLongitudEvid: "",
  eviTiporegistEvid: "1",
  eviEstadoregEvid: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

function mapInitialData(data: EvidenciaDto): FormValues {
  return {
    eviIdentifkeyEvid: data.eviIdentifkeyEvid ?? "",
    eviIdentifkeyTiev: data.eviIdentifkeyTiev ?? "",
    eviNombrearchivoEvid: data.eviNombrearchivoEvid ?? "",
    eviDescripcionEvid: data.eviDescripcionEvid ?? "",
    eviUrlarchivoEvid: data.eviUrlarchivoEvid ?? "",
    eviFechacapturaEvid: data.eviFechacapturaEvid ?? "",
    eviLatitudEvid:
      typeof data.eviLatitudEvid === "number" ? data.eviLatitudEvid : "",
    eviLongitudEvid:
      typeof data.eviLongitudEvid === "number" ? data.eviLongitudEvid : "",
    eviTiporegistEvid: normalizeTipoRegistro(data.eviTiporegistEvid),
    eviEstadoregEvid: normalizeEstadoRegistro(data.eviEstadoregEvid)
  };
}

export function EvidenciaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: EvidenciaFormProps) {
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
      eviPrimarykeyEvid: initialData?.eviPrimarykeyEvid,
      eviIdentifkeyEvid: normalizeKey(values.eviIdentifkeyEvid),
      eviIdentifkeyTiev: normalizeKey(values.eviIdentifkeyTiev),
      eviNombrearchivoEvid: normalizeText(values.eviNombrearchivoEvid),
      eviDescripcionEvid:
        normalizeText(values.eviDescripcionEvid) || undefined,
      eviUrlarchivoEvid: normalizeText(values.eviUrlarchivoEvid),
      eviFechacapturaEvid: values.eviFechacapturaEvid || undefined,
      eviLatitudEvid: toOptionalNumber(values.eviLatitudEvid),
      eviLongitudEvid: toOptionalNumber(values.eviLongitudEvid),
      eviTiporegistEvid: normalizeTipoRegistro(values.eviTiporegistEvid),
      eviEstadoregEvid: normalizeEstadoRegistro(
        values.eviEstadoregEvid
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
          {initialData ? "Editar evidencia" : "Crear evidencia / foto"}
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
          Registra fotos, documentos, videos o soportes asociados a la ejecución
          y trazabilidad de obra.
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
            Información del archivo
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Código evidencia"
                placeholder="EVID-0001"
                error={Boolean(errors.eviIdentifkeyEvid)}
                helperText={
                  errors.eviIdentifkeyEvid?.message ??
                  "Código único de la evidencia."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("eviIdentifkeyEvid", {
                  required: "El código de evidencia es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código de evidencia es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo evidencia"
                placeholder="TIEV-0001"
                error={Boolean(errors.eviIdentifkeyTiev)}
                helperText={
                  errors.eviIdentifkeyTiev?.message ??
                  "Código del tipo de evidencia."
                }
                {...register("eviIdentifkeyTiev", {
                  required: "El tipo de evidencia es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El tipo de evidencia es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre archivo"
                placeholder="foto-avance-frente-norte.jpg"
                error={Boolean(errors.eviNombrearchivoEvid)}
                helperText={errors.eviNombrearchivoEvid?.message}
                {...register("eviNombrearchivoEvid", {
                  required: "El nombre del archivo es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El nombre del archivo debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El nombre del archivo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="URL archivo"
                placeholder="https://storage.../archivo.jpg"
                error={Boolean(errors.eviUrlarchivoEvid)}
                helperText={
                  errors.eviUrlarchivoEvid?.message ??
                  "Ruta o URL donde se encuentra almacenada la evidencia."
                }
                {...register("eviUrlarchivoEvid", {
                  required: "La URL del archivo es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La URL del archivo es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Describe el contenido de la evidencia y su contexto de obra."
                error={Boolean(errors.eviDescripcionEvid)}
                helperText={errors.eviDescripcionEvid?.message}
                {...register("eviDescripcionEvid", {
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
            Fecha y ubicación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha captura"
                error={Boolean(errors.eviFechacapturaEvid)}
                helperText={errors.eviFechacapturaEvid?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("eviFechacapturaEvid", {
                  required: "La fecha de captura es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitud"
                placeholder="Ejemplo: 4.7110"
                error={Boolean(errors.eviLatitudEvid)}
                helperText={
                  errors.eviLatitudEvid?.message ??
                  "Opcional. Debe estar entre -90 y 90."
                }
                slotProps={{
                  htmlInput: {
                    min: -90,
                    max: 90,
                    step: "0.000001"
                  }
                }}
                {...register("eviLatitudEvid", {
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitud"
                placeholder="Ejemplo: -74.0721"
                error={Boolean(errors.eviLongitudEvid)}
                helperText={
                  errors.eviLongitudEvid?.message ??
                  "Opcional. Debe estar entre -180 y 180."
                }
                slotProps={{
                  htmlInput: {
                    min: -180,
                    max: 180,
                    step: "0.000001"
                  }
                }}
                {...register("eviLongitudEvid", {
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
                name="eviTiporegistEvid"
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
                name="eviEstadoregEvid"
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
            {loading ? "Guardando..." : "Guardar evidencia"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}