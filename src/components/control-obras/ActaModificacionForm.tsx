"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
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
    orsTiporegistAcmo: data.orsTiporegistAcmo ?? "1",
    orsEstadoregAcmo: data.orsEstadoregAcmo ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
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
    const actual = toOptionalNumber(valorActual) ?? 0;
    const modificado = toOptionalNumber(valorModificado) ?? 0;

    setValue("orsValortotalAcmo", actual + modificado, {
      shouldDirty: true,
      shouldValidate: false
    });
  }, [valorActual, valorModificado, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyAcmo: initialData?.orsPrimarykeyAcmo,
      orsIdentifkeyAcmo: values.orsIdentifkeyAcmo.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsNumeroactaAcmo: values.orsNumeroactaAcmo.trim(),
      orsFechaactaAcmo: values.orsFechaactaAcmo,

      orsTipoactaAcmo: values.orsTipoactaAcmo.trim().toUpperCase(),
      orsConceptoAcmo: values.orsConceptoAcmo.trim(),
      orsDescripcionAcmo: values.orsDescripcionAcmo.trim(),
      orsJustificacionAcmo: values.orsJustificacionAcmo.trim(),

      orsValoractualAcmo: toOptionalNumber(values.orsValoractualAcmo),
      orsValormodificadoAcmo: toOptionalNumber(values.orsValormodificadoAcmo),
      orsValortotalAcmo: toOptionalNumber(values.orsValortotalAcmo),

      orsFechainicioActualAcmo: values.orsFechainicioActualAcmo,
      orsFechafinActualAcmo: values.orsFechafinActualAcmo,
      orsFechainicioNuevaAcmo: values.orsFechainicioNuevaAcmo,
      orsFechafinNuevaAcmo: values.orsFechafinNuevaAcmo,

      orsObservacionAcmo: values.orsObservacionAcmo.trim(),
      orsTiporegistAcmo: values.orsTiporegistAcmo || "1",
      orsEstadoregAcmo: (values.orsEstadoregAcmo || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        {initialData
          ? "Editar acta de modificación"
          : "Crear acta de modificación"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código acta"
                placeholder="ACMO-0001"
                error={Boolean(errors.orsIdentifkeyAcmo)}
                helperText={errors.orsIdentifkeyAcmo?.message}
                {...register("orsIdentifkeyAcmo", {
                  required: "El código del acta es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={errors.orsIdentifkeyOrde?.message}
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Número acta"
                placeholder="001"
                {...register("orsNumeroactaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha acta"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechaactaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo acta"
                placeholder="ADICION, PRORROGA, SUSPENSION"
                {...register("orsTipoactaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Concepto"
                {...register("orsConceptoAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                {...register("orsDescripcionAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Justificación"
                {...register("orsJustificacionAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor actual"
                {...register("orsValoractualAcmo", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor modificado"
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
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                {...register("orsValortotalAcmo", {
                  valueAsNumber: true
                })}
              />
            </Grid>

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
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinActualAcmo")}
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
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinNuevaAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                {...register("orsObservacionAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistAcmo")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregAcmo")}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}