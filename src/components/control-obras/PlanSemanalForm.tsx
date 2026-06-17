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

import { PlanSemanalDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPlse: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPltr: string;
  orsIdentifkeyPsem: string;
  orsCantidunidadPlse: number | "";
  orsValorunidadPlse: number | "";
  orsValortotalPlse: number | "";
  orsEjecutunidadPlse: number | "";
  orsValorejecutPlse: number | "";
  orsTiporegistPlse: string;
  orsEstadoregPlse: string;
}

interface PlanSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanSemanalDto | null;
  onClose: () => void;
  onSubmit: (data: PlanSemanalDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPlse: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPltr: "",
  orsIdentifkeyPsem: "",
  orsCantidunidadPlse: "",
  orsValorunidadPlse: "",
  orsValortotalPlse: "",
  orsEjecutunidadPlse: "",
  orsValorejecutPlse: "",
  orsTiporegistPlse: "1",
  orsEstadoregPlse: "1"
};

function mapInitialData(data: PlanSemanalDto): FormValues {
  return {
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPltr: data.orsIdentifkeyPltr ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsCantidunidadPlse:
      typeof data.orsCantidunidadPlse === "number"
        ? data.orsCantidunidadPlse
        : "",
    orsValorunidadPlse:
      typeof data.orsValorunidadPlse === "number"
        ? data.orsValorunidadPlse
        : "",
    orsValortotalPlse:
      typeof data.orsValortotalPlse === "number"
        ? data.orsValortotalPlse
        : "",
    orsEjecutunidadPlse:
      typeof data.orsEjecutunidadPlse === "number"
        ? data.orsEjecutunidadPlse
        : "",
    orsValorejecutPlse:
      typeof data.orsValorejecutPlse === "number"
        ? data.orsValorejecutPlse
        : "",
    orsTiporegistPlse: data.orsTiporegistPlse ?? "1",
    orsEstadoregPlse: data.orsEstadoregPlse ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

export function PlanSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: PlanSemanalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
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
      orsPrimarykeyPlse: initialData?.orsPrimarykeyPlse,
      orsIdentifkeyPlse: values.orsIdentifkeyPlse.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPltr: values.orsIdentifkeyPltr.trim(),
      orsIdentifkeyPsem: values.orsIdentifkeyPsem.trim(),
      orsCantidunidadPlse: toOptionalNumber(values.orsCantidunidadPlse),
      orsValorunidadPlse: toOptionalNumber(values.orsValorunidadPlse),
      orsValortotalPlse: toOptionalNumber(values.orsValortotalPlse),
      orsEjecutunidadPlse: toOptionalNumber(values.orsEjecutunidadPlse),
      orsValorejecutPlse: toOptionalNumber(values.orsValorejecutPlse),
      orsTiporegistPlse: values.orsTiporegistPlse || "1",
      orsEstadoregPlse: (values.orsEstadoregPlse || "1") as EstadoRegistro
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
        {initialData ? "Editar plan semanal" : "Crear plan semanal"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Código plan semanal"
                placeholder="PLSE-0001"
                error={Boolean(errors.orsIdentifkeyPlse)}
                helperText={errors.orsIdentifkeyPlse?.message}
                {...register("orsIdentifkeyPlse", {
                  required: "El código del plan semanal es obligatorio"
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
                label="Plan de trabajo"
                placeholder="PLTR-0001"
                error={Boolean(errors.orsIdentifkeyPltr)}
                helperText={errors.orsIdentifkeyPltr?.message}
                {...register("orsIdentifkeyPltr", {
                  required: "El plan de trabajo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Proyección semanal"
                placeholder="PSEM-0001"
                error={Boolean(errors.orsIdentifkeyPsem)}
                helperText={errors.orsIdentifkeyPsem?.message}
                {...register("orsIdentifkeyPsem", {
                  required: "La proyección semanal es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad programada"
                {...register("orsCantidunidadPlse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                {...register("orsValorunidadPlse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                {...register("orsValortotalPlse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad ejecutada"
                {...register("orsEjecutunidadPlse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor ejecutado"
                {...register("orsValorejecutPlse", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistPlse")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregPlse")}
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