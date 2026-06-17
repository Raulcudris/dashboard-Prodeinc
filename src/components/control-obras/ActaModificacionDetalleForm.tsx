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
    orsTiporegistAcdt: data.orsTiporegistAcdt ?? "1",
    orsEstadoregAcdt: data.orsEstadoregAcdt ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
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
    const actual = toOptionalNumber(cantidadActual) ?? 0;
    const modificada = toOptionalNumber(cantidadModificada) ?? 0;
    const unidad = toOptionalNumber(valorUnidad) ?? 0;

    const valorActual = actual * unidad;
    const valorModificado = modificada * unidad;

    setValue("orsValoractualAcdt", valorActual, {
      shouldDirty: true,
      shouldValidate: false
    });

    setValue("orsValormodificadoAcdt", valorModificado, {
      shouldDirty: true,
      shouldValidate: false
    });

    setValue("orsValortotalAcdt", valorActual + valorModificado, {
      shouldDirty: true,
      shouldValidate: false
    });
  }, [cantidadActual, cantidadModificada, valorUnidad, setValue]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyAcdt: initialData?.orsPrimarykeyAcdt,
      orsIdentifkeyAcdt: values.orsIdentifkeyAcdt.trim().toUpperCase(),

      orsIdentifkeyAcmo: values.orsIdentifkeyAcmo.trim(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPltr: values.orsIdentifkeyPltr.trim(),
      orsIdentifkeyPlse: values.orsIdentifkeyPlse.trim(),
      orsIdentifkeyPunt: values.orsIdentifkeyPunt.trim(),

      orsDescripcionAcdt: values.orsDescripcionAcdt.trim(),
      orsUnidadAcdt: values.orsUnidadAcdt.trim().toUpperCase(),

      orsCantidadactualAcdt: toOptionalNumber(values.orsCantidadactualAcdt),
      orsCantidadmodificadaAcdt: toOptionalNumber(
        values.orsCantidadmodificadaAcdt
      ),
      orsValorunidadAcdt: toOptionalNumber(values.orsValorunidadAcdt),
      orsValoractualAcdt: toOptionalNumber(values.orsValoractualAcdt),
      orsValormodificadoAcdt: toOptionalNumber(values.orsValormodificadoAcdt),
      orsValortotalAcdt: toOptionalNumber(values.orsValortotalAcdt),

      orsObservacionAcdt: values.orsObservacionAcdt.trim(),
      orsTiporegistAcdt: values.orsTiporegistAcdt || "1",
      orsEstadoregAcdt: (values.orsEstadoregAcdt || "1") as EstadoRegistro
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
          ? "Editar detalle de acta"
          : "Crear detalle de acta"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código detalle"
                placeholder="ACDT-0001"
                error={Boolean(errors.orsIdentifkeyAcdt)}
                helperText={errors.orsIdentifkeyAcdt?.message}
                {...register("orsIdentifkeyAcdt", {
                  required: "El código del detalle es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Acta modificación"
                placeholder="ACMO-0001"
                error={Boolean(errors.orsIdentifkeyAcmo)}
                helperText={errors.orsIdentifkeyAcmo?.message}
                {...register("orsIdentifkeyAcmo", {
                  required: "El acta de modificación es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Orden servicio"
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
                label="Sitio / punto"
                placeholder="PUNT-0001"
                {...register("orsIdentifkeyPunt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan trabajo"
                placeholder="PLTR-0001"
                {...register("orsIdentifkeyPltr")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Plan semanal"
                placeholder="PLSE-0001"
                {...register("orsIdentifkeyPlse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Unidad"
                placeholder="M3, ML, UND, HORA"
                {...register("orsUnidadAcdt")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                {...register("orsDescripcionAcdt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad actual"
                {...register("orsCantidadactualAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad modificada"
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
                {...register("orsValorunidadAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor actual"
                slotProps={{
                  input: {
                    readOnly: true
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
                slotProps={{
                  input: {
                    readOnly: true
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
                slotProps={{
                  input: {
                    readOnly: true
                  }
                }}
                {...register("orsValortotalAcdt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                {...register("orsObservacionAcdt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistAcdt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregAcdt")}
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