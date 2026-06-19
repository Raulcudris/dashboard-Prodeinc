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

import { ActaModificacionDetalleDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyAcdt: string;

  orsIdentifkeyAcmo: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPltr: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPunt: string;

  orsDescripcionAcdt: string;
  orsUnidadAcdt: string;

  orsCantidadactualAcdt: number | "";
  orsCantidadmodificadaAcdt: number | "";
  orsValorunidadAcdt: number | "";
  orsValoractualAcdt: number | "";
  orsValormodificadoAcdt: number | "";
  orsValortotalAcdt: number | "";

  orsObservacionAcdt: string;
  orsTiporegistAcdt: string;
  orsEstadoregAcdt: string;
}

interface ActaModificacionDetalleFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ActaModificacionDetalleDto | null;
  onClose: () => void;
  onSubmit: (data: ActaModificacionDetalleDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyAcdt: "",

  orsIdentifkeyAcmo: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPltr: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPunt: "",

  orsDescripcionAcdt: "",
  orsUnidadAcdt: "",

  orsCantidadactualAcdt: "",
  orsCantidadmodificadaAcdt: "",
  orsValorunidadAcdt: "",
  orsValoractualAcdt: "",
  orsValormodificadoAcdt: "",
  orsValortotalAcdt: "",

  orsObservacionAcdt: "",
  orsTiporegistAcdt: "1",
  orsEstadoregAcdt: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: ActaModificacionDetalleDto): FormValues {
  return {
    orsIdentifkeyAcdt: data.orsIdentifkeyAcdt ?? "",

    orsIdentifkeyAcmo: data.orsIdentifkeyAcmo ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPltr: data.orsIdentifkeyPltr ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",

    orsDescripcionAcdt: data.orsDescripcionAcdt ?? "",
    orsUnidadAcdt: data.orsUnidadAcdt ?? "",

    orsCantidadactualAcdt:
      typeof data.orsCantidadactualAcdt === "number"
        ? data.orsCantidadactualAcdt
        : "",
    orsCantidadmodificadaAcdt:
      typeof data.orsCantidadmodificadaAcdt === "number"
        ? data.orsCantidadmodificadaAcdt
        : "",
    orsValorunidadAcdt:
      typeof data.orsValorunidadAcdt === "number"
        ? data.orsValorunidadAcdt
        : "",
    orsValoractualAcdt:
      typeof data.orsValoractualAcdt === "number"
        ? data.orsValoractualAcdt
        : "",
    orsValormodificadoAcdt:
      typeof data.orsValormodificadoAcdt === "number"
        ? data.orsValormodificadoAcdt
        : "",
    orsValortotalAcdt:
      typeof data.orsValortotalAcdt === "number"
        ? data.orsValortotalAcdt
        : "",

    orsObservacionAcdt: data.orsObservacionAcdt ?? "",
    orsTiporegistAcdt: normalizeTipoRegistro(data.orsTiporegistAcdt),
    orsEstadoregAcdt: normalizeEstadoRegistro(data.orsEstadoregAcdt)
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

export function ActaModificacionDetalleForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ActaModificacionDetalleFormProps) {
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

  const cantidadActual = watch("orsCantidadactualAcdt");
  const cantidadModificada = watch("orsCantidadmodificadaAcdt");
  const valorUnidad = watch("orsValorunidadAcdt");

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

    const valorActual = safeNumber(cantidadActual) * safeNumber(valorUnidad);
    const valorModificado =
      safeNumber(cantidadModificada) * safeNumber(valorUnidad);
    const valorTotal = valorActual + valorModificado;

    setValue("orsValoractualAcdt", valorActual > 0 ? valorActual : "", {
      shouldDirty: true,
      shouldValidate: true
    });

    setValue(
      "orsValormodificadoAcdt",
      valorModificado > 0 ? valorModificado : "",
      {
        shouldDirty: true,
        shouldValidate: true
      }
    );

    setValue("orsValortotalAcdt", valorTotal > 0 ? valorTotal : "", {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [open, cantidadActual, cantidadModificada, valorUnidad, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyAcdt: initialData?.orsPrimarykeyAcdt,
      orsIdentifkeyAcdt: normalizeKey(values.orsIdentifkeyAcdt),

      orsIdentifkeyAcmo: normalizeKey(values.orsIdentifkeyAcmo),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsIdentifkeyPltr: normalizeKey(values.orsIdentifkeyPltr) || undefined,
      orsIdentifkeyPlse: normalizeKey(values.orsIdentifkeyPlse) || undefined,
      orsIdentifkeyPunt: normalizeKey(values.orsIdentifkeyPunt) || undefined,

      orsDescripcionAcdt:
        normalizeText(values.orsDescripcionAcdt) || undefined,
      orsUnidadAcdt: normalizeKey(values.orsUnidadAcdt) || undefined,

      orsCantidadactualAcdt: toOptionalNumber(values.orsCantidadactualAcdt),
      orsCantidadmodificadaAcdt: toOptionalNumber(
        values.orsCantidadmodificadaAcdt
      ),
      orsValorunidadAcdt: toOptionalNumber(values.orsValorunidadAcdt),
      orsValoractualAcdt: toOptionalNumber(values.orsValoractualAcdt),
      orsValormodificadoAcdt: toOptionalNumber(values.orsValormodificadoAcdt),
      orsValortotalAcdt: toOptionalNumber(values.orsValortotalAcdt),

      orsObservacionAcdt: normalizeText(values.orsObservacionAcdt) || undefined,
      orsTiporegistAcdt: normalizeTipoRegistro(values.orsTiporegistAcdt),
      orsEstadoregAcdt: normalizeEstadoRegistro(
        values.orsEstadoregAcdt
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
          {initialData ? "Editar detalle de acta" : "Crear detalle de acta"}
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
          Registra el detalle técnico, cantidades y valores modificados dentro
          de un acta de modificación.
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
                label="Código detalle"
                placeholder="ACDT-0001"
                error={Boolean(errors.orsIdentifkeyAcdt)}
                helperText={
                  errors.orsIdentifkeyAcdt?.message ??
                  "Código único del detalle del acta."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyAcdt", {
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
                label="Acta modificación"
                placeholder="ACMO-0001"
                error={Boolean(errors.orsIdentifkeyAcmo)}
                helperText={
                  errors.orsIdentifkeyAcmo?.message ??
                  "Código del acta de modificación."
                }
                {...register("orsIdentifkeyAcmo", {
                  required: "El acta de modificación es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El acta de modificación es obligatoria"
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
                helperText="Opcional. Sitio o punto relacionado."
                {...register("orsIdentifkeyPunt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan trabajo"
                placeholder="PLTR-0001"
                helperText="Opcional. Plan de trabajo relacionado."
                {...register("orsIdentifkeyPltr")}
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

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Unidad"
                placeholder="M3, ML, UND, HORA"
                helperText="Unidad de medida del ítem modificado."
                {...register("orsUnidadAcdt")}
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
            Descripción del detalle
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Describe el ítem, actividad o concepto modificado."
                error={Boolean(errors.orsDescripcionAcdt)}
                helperText={errors.orsDescripcionAcdt?.message}
                {...register("orsDescripcionAcdt", {
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
            Cantidades y valores
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad actual"
                error={Boolean(errors.orsCantidadactualAcdt)}
                helperText={errors.orsCantidadactualAcdt?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsCantidadactualAcdt", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "La cantidad actual no puede ser negativa"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad modificada"
                error={Boolean(errors.orsCantidadmodificadaAcdt)}
                helperText={errors.orsCantidadmodificadaAcdt?.message}
                slotProps={{
                  htmlInput: {
                    step: "0.01"
                  }
                }}
                {...register("orsCantidadmodificadaAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                error={Boolean(errors.orsValorunidadAcdt)}
                helperText={errors.orsValorunidadAcdt?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValorunidadAcdt", {
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
                label="Valor actual"
                helperText="Se calcula automáticamente."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    step: "0.01"
                  }
                }}
                {...register("orsValoractualAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor modificado"
                helperText="Se calcula automáticamente."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    step: "0.01"
                  }
                }}
                {...register("orsValormodificadoAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                helperText="Se calcula automáticamente: valor actual + valor modificado."
                slotProps={{
                  input: {
                    readOnly: true
                  },
                  htmlInput: {
                    step: "0.01"
                  }
                }}
                {...register("orsValortotalAcdt", {
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
            Observación y control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                placeholder="Registra comentarios adicionales sobre el detalle del acta."
                error={Boolean(errors.orsObservacionAcdt)}
                helperText={errors.orsObservacionAcdt?.message}
                {...register("orsObservacionAcdt", {
                  minLength: {
                    value: 5,
                    message: "La observación debe tener mínimo 5 caracteres"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsTiporegistAcdt"
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
                name="orsEstadoregAcdt"
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