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

import { PlanTrabajoDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPltr: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPunt: string;
  orsDesactividadPltr: string;
  orsIdentifkeyRseq: string;
  prvIdentifkeyInve: string;
  orsCantidunidadRseq: number | "";
  orsValorunidadRseq: number | "";
  orsValortotalRseq: number | "";
  orsTiporegistPltr: string;
  orsEstadoregPltr: string;
}

interface PlanTrabajoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanTrabajoDto | null;
  onClose: () => void;
  onSubmit: (data: PlanTrabajoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPltr: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPunt: "",
  orsDesactividadPltr: "",
  orsIdentifkeyRseq: "",
  prvIdentifkeyInve: "",
  orsCantidunidadRseq: "",
  orsValorunidadRseq: "",
  orsValortotalRseq: "",
  orsTiporegistPltr: "1",
  orsEstadoregPltr: "1"
};

function mapInitialData(data: PlanTrabajoDto): FormValues {
  return {
    orsIdentifkeyPltr: data.orsIdentifkeyPltr ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",
    orsDesactividadPltr: data.orsDesactividadPltr ?? "",
    orsIdentifkeyRseq: data.orsIdentifkeyRseq ?? "",
    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    orsCantidunidadRseq:
      typeof data.orsCantidunidadRseq === "number"
        ? data.orsCantidunidadRseq
        : "",
    orsValorunidadRseq:
      typeof data.orsValorunidadRseq === "number"
        ? data.orsValorunidadRseq
        : "",
    orsValortotalRseq:
      typeof data.orsValortotalRseq === "number"
        ? data.orsValortotalRseq
        : "",
    orsTiporegistPltr: data.orsTiporegistPltr ?? "1",
    orsEstadoregPltr: data.orsEstadoregPltr ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

export function PlanTrabajoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: PlanTrabajoFormProps) {
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
      orsPrimarykeyPltr: initialData?.orsPrimarykeyPltr,
      orsIdentifkeyPltr: values.orsIdentifkeyPltr.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPunt: values.orsIdentifkeyPunt.trim(),
      orsDesactividadPltr: values.orsDesactividadPltr.trim(),
      orsIdentifkeyRseq: values.orsIdentifkeyRseq.trim(),
      prvIdentifkeyInve: values.prvIdentifkeyInve.trim(),
      orsCantidunidadRseq: toOptionalNumber(values.orsCantidunidadRseq),
      orsValorunidadRseq: toOptionalNumber(values.orsValorunidadRseq),
      orsValortotalRseq: toOptionalNumber(values.orsValortotalRseq),
      orsTiporegistPltr: values.orsTiporegistPltr || "1",
      orsEstadoregPltr: (values.orsEstadoregPltr || "1") as EstadoRegistro
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
        {initialData ? "Editar plan de trabajo" : "Crear plan de trabajo"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código plan"
                placeholder="PLTR-0001"
                error={Boolean(errors.orsIdentifkeyPltr)}
                helperText={errors.orsIdentifkeyPltr?.message}
                {...register("orsIdentifkeyPltr", {
                  required: "El código del plan es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Sitio / punto"
                placeholder="PUNT-0001"
                error={Boolean(errors.orsIdentifkeyPunt)}
                helperText={errors.orsIdentifkeyPunt?.message}
                {...register("orsIdentifkeyPunt", {
                  required: "El sitio o punto es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Actividad proyectada"
                error={Boolean(errors.orsDesactividadPltr)}
                helperText={errors.orsDesactividadPltr?.message}
                {...register("orsDesactividadPltr", {
                  required: "La actividad proyectada es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Resumen equipo"
                placeholder="RSEQ-0001"
                {...register("orsIdentifkeyRseq")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Equipo / inventario"
                placeholder="INVE-0001"
                {...register("prvIdentifkeyInve")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Cantidad"
                {...register("orsCantidunidadRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor unidad"
                {...register("orsValorunidadRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                {...register("orsValortotalRseq", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistPltr")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregPltr")}
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