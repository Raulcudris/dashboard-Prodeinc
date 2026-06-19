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

import { DetalleEquipoOperacionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyDeop: string;
  orsIdentifkeyRope: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPsem: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPunt: string;

  prvIdentifkeyInve: string;
  prvTipoequipoTieq: string;

  orsNombrequipoDeop: string;
  orsRefermodeloDeop: string;
  orsNroregistroDeop: string;

  orsUnidadDeop: string;
  orsTipocontrolDeop: string;
  orsFechatrabajoDeop: string;

  orsHorometroiniDeop: number | "";
  orsHorometrofinDeop: number | "";

  orsKminicialDeop: number | "";
  orsKmfinalDeop: number | "";

  orsDiatrabajadoDeop: number | "";
  orsValorunidadDeop: number | "";

  orsObservacionDeop: string;
  orsFirmasuministroDeop: string;
  orsFirmaseguimientoDeop: string;

  orsTiporegistDeop: string;
  orsEstadoregDeop: string;
}

interface DetalleEquipoOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: DetalleEquipoOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: DetalleEquipoOperacionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyDeop: "",
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPsem: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPunt: "",

  prvIdentifkeyInve: "",
  prvTipoequipoTieq: "",

  orsNombrequipoDeop: "",
  orsRefermodeloDeop: "",
  orsNroregistroDeop: "",

  orsUnidadDeop: "",
  orsTipocontrolDeop: "",
  orsFechatrabajoDeop: "",

  orsHorometroiniDeop: "",
  orsHorometrofinDeop: "",

  orsKminicialDeop: "",
  orsKmfinalDeop: "",

  orsDiatrabajadoDeop: "",
  orsValorunidadDeop: "",

  orsObservacionDeop: "",
  orsFirmasuministroDeop: "",
  orsFirmaseguimientoDeop: "",

  orsTiporegistDeop: "1",
  orsEstadoregDeop: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: DetalleEquipoOperacionDto): FormValues {
  return {
    orsIdentifkeyDeop: data.orsIdentifkeyDeop ?? "",
    orsIdentifkeyRope: data.orsIdentifkeyRope ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",

    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",

    orsNombrequipoDeop: data.orsNombrequipoDeop ?? "",
    orsRefermodeloDeop: data.orsRefermodeloDeop ?? "",
    orsNroregistroDeop: data.orsNroregistroDeop ?? "",

    orsUnidadDeop: data.orsUnidadDeop ?? "",
    orsTipocontrolDeop: data.orsTipocontrolDeop ?? "",
    orsFechatrabajoDeop: data.orsFechatrabajoDeop ?? "",

    orsHorometroiniDeop:
      typeof data.orsHorometroiniDeop === "number"
        ? data.orsHorometroiniDeop
        : "",
    orsHorometrofinDeop:
      typeof data.orsHorometrofinDeop === "number"
        ? data.orsHorometrofinDeop
        : "",

    orsKminicialDeop:
      typeof data.orsKminicialDeop === "number" ? data.orsKminicialDeop : "",
    orsKmfinalDeop:
      typeof data.orsKmfinalDeop === "number" ? data.orsKmfinalDeop : "",

    orsDiatrabajadoDeop:
      typeof data.orsDiatrabajadoDeop === "number"
        ? data.orsDiatrabajadoDeop
        : "",
    orsValorunidadDeop:
      typeof data.orsValorunidadDeop === "number"
        ? data.orsValorunidadDeop
        : "",

    orsObservacionDeop: data.orsObservacionDeop ?? "",
    orsFirmasuministroDeop: data.orsFirmasuministroDeop ?? "",
    orsFirmaseguimientoDeop: data.orsFirmaseguimientoDeop ?? "",

    orsTiporegistDeop: normalizeTipoRegistro(data.orsTiporegistDeop),
    orsEstadoregDeop: normalizeEstadoRegistro(data.orsEstadoregDeop)
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

export function DetalleEquipoOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: DetalleEquipoOperacionFormProps) {
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
      orsPrimarykeyDeop: initialData?.orsPrimarykeyDeop,

      orsIdentifkeyDeop: normalizeKey(values.orsIdentifkeyDeop),
      orsIdentifkeyRope: normalizeKey(values.orsIdentifkeyRope),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPsem: normalizeKey(values.orsIdentifkeyPsem) || undefined,
      orsIdentifkeyPlse: normalizeKey(values.orsIdentifkeyPlse) || undefined,
      orsIdentifkeyPunt: normalizeKey(values.orsIdentifkeyPunt) || undefined,

      prvIdentifkeyInve: normalizeKey(values.prvIdentifkeyInve),
      prvTipoequipoTieq: normalizeKey(values.prvTipoequipoTieq) || undefined,

      orsNombrequipoDeop: normalizeText(values.orsNombrequipoDeop) || undefined,
      orsRefermodeloDeop: normalizeText(values.orsRefermodeloDeop) || undefined,
      orsNroregistroDeop: normalizeKey(values.orsNroregistroDeop) || undefined,

      orsUnidadDeop: normalizeKey(values.orsUnidadDeop) || undefined,
      orsTipocontrolDeop: normalizeKey(values.orsTipocontrolDeop) || undefined,
      orsFechatrabajoDeop: values.orsFechatrabajoDeop || undefined,

      orsHorometroiniDeop: toOptionalNumber(values.orsHorometroiniDeop),
      orsHorometrofinDeop: toOptionalNumber(values.orsHorometrofinDeop),

      orsKminicialDeop: toOptionalNumber(values.orsKminicialDeop),
      orsKmfinalDeop: toOptionalNumber(values.orsKmfinalDeop),

      orsDiatrabajadoDeop: toOptionalNumber(values.orsDiatrabajadoDeop),
      orsValorunidadDeop: toOptionalNumber(values.orsValorunidadDeop),

      orsObservacionDeop: normalizeText(values.orsObservacionDeop) || undefined,
      orsFirmasuministroDeop:
        normalizeText(values.orsFirmasuministroDeop) || undefined,
      orsFirmaseguimientoDeop:
        normalizeText(values.orsFirmaseguimientoDeop) || undefined,

      orsTiporegistDeop: normalizeTipoRegistro(values.orsTiporegistDeop),
      orsEstadoregDeop: normalizeEstadoRegistro(
        values.orsEstadoregDeop
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
          {initialData
            ? "Editar detalle de operación"
            : "Crear detalle de operación"}
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
          Registra la operación diaria de maquinaria o equipo asociada a un
          reporte de operación.
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
            Relación con obra
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código detalle"
                placeholder="DEOP-0001"
                error={Boolean(errors.orsIdentifkeyDeop)}
                helperText={
                  errors.orsIdentifkeyDeop?.message ??
                  "Código único del detalle de operación."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyDeop", {
                  required: "El código del detalle es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del detalle es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Reporte operación"
                placeholder="ROPE-0001"
                error={Boolean(errors.orsIdentifkeyRope)}
                helperText={
                  errors.orsIdentifkeyRope?.message ??
                  "Código del reporte de operación."
                }
                {...register("orsIdentifkeyRope", {
                  required: "El reporte de operación es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El reporte de operación es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Orden servicio"
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
                label="Sitio / punto"
                placeholder="PUNT-0001"
                helperText="Opcional. Sitio o punto de trabajo."
                {...register("orsIdentifkeyPunt")}
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
            Información del equipo
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Equipo / inventario"
                placeholder="INVE-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={
                  errors.prvIdentifkeyInve?.message ??
                  "Código del equipo o inventario."
                }
                {...register("prvIdentifkeyInve", {
                  required: "El equipo es obligatorio",
                  validate: value =>
                    value.trim().length > 0 || "El equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tipo equipo"
                placeholder="RETROEXCAVADORA"
                helperText="Opcional. Tipo de maquinaria o equipo."
                {...register("prvTipoequipoTieq")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Nombre equipo"
                placeholder="Retroexcavadora CAT 420"
                helperText="Opcional. Nombre descriptivo del equipo."
                {...register("orsNombrequipoDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Referencia / modelo"
                placeholder="CAT 420F2"
                helperText="Opcional. Modelo o referencia."
                {...register("orsRefermodeloDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Número registro"
                placeholder="PLACA / SERIAL"
                helperText="Opcional. Placa, serial o registro."
                {...register("orsNroregistroDeop")}
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
            Control de operación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Unidad"
                placeholder="HORA, DIA, KM"
                helperText="Unidad de control operacional."
                {...register("orsUnidadDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tipo control"
                placeholder="HOROMETRO, KILOMETRAJE, DIA"
                helperText="Tipo de medición del trabajo."
                {...register("orsTipocontrolDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha trabajo"
                error={Boolean(errors.orsFechatrabajoDeop)}
                helperText={errors.orsFechatrabajoDeop?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechatrabajoDeop", {
                  required: "La fecha de trabajo es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Día trabajado"
                error={Boolean(errors.orsDiatrabajadoDeop)}
                helperText={errors.orsDiatrabajadoDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsDiatrabajadoDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El día trabajado no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Horómetro inicial"
                error={Boolean(errors.orsHorometroiniDeop)}
                helperText={errors.orsHorometroiniDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsHorometroiniDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El horómetro inicial no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Horómetro final"
                error={Boolean(errors.orsHorometrofinDeop)}
                helperText={errors.orsHorometrofinDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsHorometrofinDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El horómetro final no puede ser negativo"
                  },
                  validate: value => {
                    const inicial = getValues("orsHorometroiniDeop");

                    if (
                      value === "" ||
                      inicial === "" ||
                      Number.isNaN(value) ||
                      Number.isNaN(inicial)
                    ) {
                      return true;
                    }

                    return (
                      Number(value) >= Number(inicial) ||
                      "El horómetro final no puede ser menor al inicial"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Km inicial"
                error={Boolean(errors.orsKminicialDeop)}
                helperText={errors.orsKminicialDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsKminicialDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El km inicial no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Km final"
                error={Boolean(errors.orsKmfinalDeop)}
                helperText={errors.orsKmfinalDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsKmfinalDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El km final no puede ser negativo"
                  },
                  validate: value => {
                    const inicial = getValues("orsKminicialDeop");

                    if (
                      value === "" ||
                      inicial === "" ||
                      Number.isNaN(value) ||
                      Number.isNaN(inicial)
                    ) {
                      return true;
                    }

                    return (
                      Number(value) >= Number(inicial) ||
                      "El km final no puede ser menor al inicial"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                error={Boolean(errors.orsValorunidadDeop)}
                helperText={errors.orsValorunidadDeop?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorunidadDeop", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor unidad no puede ser negativo"
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
            Observación y firmas
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                placeholder="Registra novedades, condiciones de operación o comentarios del equipo."
                error={Boolean(errors.orsObservacionDeop)}
                helperText={errors.orsObservacionDeop?.message}
                {...register("orsObservacionDeop", {
                  minLength: {
                    value: 5,
                    message: "La observación debe tener mínimo 5 caracteres"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Firma suministro"
                placeholder="Nombre, URL o referencia de firma"
                helperText="Opcional."
                {...register("orsFirmasuministroDeop")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Firma seguimiento"
                placeholder="Nombre, URL o referencia de firma"
                helperText="Opcional."
                {...register("orsFirmaseguimientoDeop")}
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
                name="orsTiporegistDeop"
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
                name="orsEstadoregDeop"
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
            {loading ? "Guardando..." : "Guardar detalle"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}