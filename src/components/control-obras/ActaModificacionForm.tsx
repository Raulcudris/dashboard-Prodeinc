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

import { ActaModificacionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyAcmo: string;
  orsIdentifkeyOrde: string;
  orsNumeroactaAcmo: string;
  orsFechaactaAcmo: string;

  orsTipoactaAcmo: string;
  orsConceptoAcmo: string;
  orsDescripcionAcmo: string;
  orsJustificacionAcmo: string;

  orsValoractualAcmo: number | "";
  orsValormodificadoAcmo: number | "";
  orsValortotalAcmo: number | "";

  orsFechainicioActualAcmo: string;
  orsFechafinActualAcmo: string;
  orsFechainicioNuevaAcmo: string;
  orsFechafinNuevaAcmo: string;

  orsObservacionAcmo: string;
  orsTiporegistAcmo: string;
  orsEstadoregAcmo: string;
}

interface ActaModificacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ActaModificacionDto | null;
  onClose: () => void;
  onSubmit: (data: ActaModificacionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyAcmo: "",
  orsIdentifkeyOrde: "",
  orsNumeroactaAcmo: "",
  orsFechaactaAcmo: "",

  orsTipoactaAcmo: "",
  orsConceptoAcmo: "",
  orsDescripcionAcmo: "",
  orsJustificacionAcmo: "",

  orsValoractualAcmo: "",
  orsValormodificadoAcmo: "",
  orsValortotalAcmo: "",

  orsFechainicioActualAcmo: "",
  orsFechafinActualAcmo: "",
  orsFechainicioNuevaAcmo: "",
  orsFechafinNuevaAcmo: "",

  orsObservacionAcmo: "",
  orsTiporegistAcmo: "1",
  orsEstadoregAcmo: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function mapInitialData(data: ActaModificacionDto): FormValues {
  return {
    orsIdentifkeyAcmo: data.orsIdentifkeyAcmo ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsNumeroactaAcmo: data.orsNumeroactaAcmo ?? "",
    orsFechaactaAcmo: data.orsFechaactaAcmo ?? "",

    orsTipoactaAcmo: data.orsTipoactaAcmo ?? "",
    orsConceptoAcmo: data.orsConceptoAcmo ?? "",
    orsDescripcionAcmo: data.orsDescripcionAcmo ?? "",
    orsJustificacionAcmo: data.orsJustificacionAcmo ?? "",

    orsValoractualAcmo:
      typeof data.orsValoractualAcmo === "number"
        ? data.orsValoractualAcmo
        : "",
    orsValormodificadoAcmo:
      typeof data.orsValormodificadoAcmo === "number"
        ? data.orsValormodificadoAcmo
        : "",
    orsValortotalAcmo:
      typeof data.orsValortotalAcmo === "number" ? data.orsValortotalAcmo : "",

    orsFechainicioActualAcmo: data.orsFechainicioActualAcmo ?? "",
    orsFechafinActualAcmo: data.orsFechafinActualAcmo ?? "",
    orsFechainicioNuevaAcmo: data.orsFechainicioNuevaAcmo ?? "",
    orsFechafinNuevaAcmo: data.orsFechafinNuevaAcmo ?? "",

    orsObservacionAcmo: data.orsObservacionAcmo ?? "",
    orsTiporegistAcmo: normalizeTipoRegistro(data.orsTiporegistAcmo),
    orsEstadoregAcmo: normalizeEstadoRegistro(data.orsEstadoregAcmo)
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

export function ActaModificacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ActaModificacionFormProps) {
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

  const valorActual = watch("orsValoractualAcmo");
  const valorModificado = watch("orsValormodificadoAcmo");

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

    const total = safeNumber(valorActual) + safeNumber(valorModificado);

    if (total > 0) {
      setValue("orsValortotalAcmo", total, {
        shouldDirty: true,
        shouldValidate: true
      });
      return;
    }

    setValue("orsValortotalAcmo", "", {
      shouldDirty: true,
      shouldValidate: true
    });
  }, [open, valorActual, valorModificado, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyAcmo: initialData?.orsPrimarykeyAcmo,
      orsIdentifkeyAcmo: normalizeKey(values.orsIdentifkeyAcmo),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsNumeroactaAcmo: normalizeText(values.orsNumeroactaAcmo) || undefined,
      orsFechaactaAcmo: values.orsFechaactaAcmo || undefined,

      orsTipoactaAcmo: normalizeKey(values.orsTipoactaAcmo) || undefined,
      orsConceptoAcmo: normalizeText(values.orsConceptoAcmo) || undefined,
      orsDescripcionAcmo:
        normalizeText(values.orsDescripcionAcmo) || undefined,
      orsJustificacionAcmo:
        normalizeText(values.orsJustificacionAcmo) || undefined,

      orsValoractualAcmo: toOptionalNumber(values.orsValoractualAcmo),
      orsValormodificadoAcmo: toOptionalNumber(values.orsValormodificadoAcmo),
      orsValortotalAcmo: toOptionalNumber(values.orsValortotalAcmo),

      orsFechainicioActualAcmo: values.orsFechainicioActualAcmo || undefined,
      orsFechafinActualAcmo: values.orsFechafinActualAcmo || undefined,
      orsFechainicioNuevaAcmo: values.orsFechainicioNuevaAcmo || undefined,
      orsFechafinNuevaAcmo: values.orsFechafinNuevaAcmo || undefined,

      orsObservacionAcmo: normalizeText(values.orsObservacionAcmo) || undefined,
      orsTiporegistAcmo: normalizeTipoRegistro(values.orsTiporegistAcmo),
      orsEstadoregAcmo: normalizeEstadoRegistro(
        values.orsEstadoregAcmo
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
            ? "Editar acta de modificación"
            : "Crear acta de modificación"}
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
          Registra cambios de alcance, plazo, valor o condiciones de ejecución
          asociados a una orden de servicio.
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
                label="Código acta"
                placeholder="ACMO-0001"
                error={Boolean(errors.orsIdentifkeyAcmo)}
                helperText={
                  errors.orsIdentifkeyAcmo?.message ??
                  "Código único del acta de modificación."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyAcmo", {
                  required: "El código del acta es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del acta es obligatorio"
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
                label="Número acta"
                placeholder="001"
                helperText="Número interno o consecutivo documental."
                {...register("orsNumeroactaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha acta"
                error={Boolean(errors.orsFechaactaAcmo)}
                helperText={errors.orsFechaactaAcmo?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechaactaAcmo", {
                  required: "La fecha del acta es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo acta"
                placeholder="ADICION, PRORROGA, SUSPENSION"
                error={Boolean(errors.orsTipoactaAcmo)}
                helperText={
                  errors.orsTipoactaAcmo?.message ??
                  "Clasificación interna del acta."
                }
                {...register("orsTipoactaAcmo", {
                  required: "El tipo de acta es obligatorio",
                  validate: value =>
                    value.trim().length > 0 || "El tipo de acta es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Concepto"
                error={Boolean(errors.orsConceptoAcmo)}
                helperText={errors.orsConceptoAcmo?.message}
                {...register("orsConceptoAcmo", {
                  required: "El concepto es obligatorio",
                  minLength: {
                    value: 5,
                    message: "El concepto debe tener mínimo 5 caracteres"
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
            Descripción y justificación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Describe el cambio solicitado o aprobado."
                error={Boolean(errors.orsDescripcionAcmo)}
                helperText={errors.orsDescripcionAcmo?.message}
                {...register("orsDescripcionAcmo", {
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
                multiline
                minRows={3}
                label="Justificación"
                placeholder="Explica la razón técnica, operativa o administrativa del cambio."
                error={Boolean(errors.orsJustificacionAcmo)}
                helperText={errors.orsJustificacionAcmo?.message}
                {...register("orsJustificacionAcmo", {
                  minLength: {
                    value: 5,
                    message: "La justificación debe tener mínimo 5 caracteres"
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
            Valores del acta
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor actual"
                error={Boolean(errors.orsValoractualAcmo)}
                helperText={errors.orsValoractualAcmo?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                {...register("orsValoractualAcmo", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor actual no puede ser negativo"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor modificado"
                error={Boolean(errors.orsValormodificadoAcmo)}
                helperText={errors.orsValormodificadoAcmo?.message}
                slotProps={{
                  htmlInput: {
                    step: "0.01"
                  }
                }}
                {...register("orsValormodificadoAcmo", {
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
                {...register("orsValortotalAcmo", {
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
            Fechas contractuales
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Inicio actual"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioActualAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fin actual"
                error={Boolean(errors.orsFechafinActualAcmo)}
                helperText={errors.orsFechafinActualAcmo?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinActualAcmo", {
                  validate: value => {
                    const fechaInicio = getValues("orsFechainicioActualAcmo");

                    if (!fechaInicio || !value) return true;

                    return (
                      value >= fechaInicio ||
                      "La fecha fin actual no puede ser menor a la fecha inicio actual"
                    );
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Inicio nuevo"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioNuevaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fin nuevo"
                error={Boolean(errors.orsFechafinNuevaAcmo)}
                helperText={errors.orsFechafinNuevaAcmo?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinNuevaAcmo", {
                  validate: value => {
                    const fechaInicio = getValues("orsFechainicioNuevaAcmo");

                    if (!fechaInicio || !value) return true;

                    return (
                      value >= fechaInicio ||
                      "La fecha fin nueva no puede ser menor a la fecha inicio nueva"
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
            Observación y control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                placeholder="Registra comentarios adicionales, restricciones o notas de seguimiento."
                error={Boolean(errors.orsObservacionAcmo)}
                helperText={errors.orsObservacionAcmo?.message}
                {...register("orsObservacionAcmo", {
                  minLength: {
                    value: 5,
                    message: "La observación debe tener mínimo 5 caracteres"
                  }
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="orsTiporegistAcmo"
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
                name="orsEstadoregAcmo"
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
            {loading ? "Guardando..." : "Guardar acta"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}