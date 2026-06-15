"use client";

import { useEffect } from "react";
import {
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

interface PlanSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanSemanalDto | null;
  onClose: () => void;
  onSubmit: (data: PlanSemanalDto) => Promise<void> | void;
}

const defaultValues: PlanSemanalDto = {
  orsIdentifkeyPlse: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPltr: "",
  orsIdentifkeyPsem: "",
  orsCantidunidadPlse: 0,
  orsValorunidadPlse: 0,
  orsValortotalPlse: 0,
  orsEjecutunidadPlse: 0,
  orsValorejecutPlse: 0,
  orsTiporegistPlse: "1",
  orsEstadoregPlse: "1"
};

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
    watch,
    setValue,
    formState: { errors }
  } = useForm<PlanSemanalDto>({
    defaultValues
  });

  const cantidad = watch("orsCantidunidadPlse");
  const valorUnidad = watch("orsValorunidadPlse");
  const ejecutado = watch("orsEjecutunidadPlse");

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  useEffect(() => {
    setValue(
      "orsValortotalPlse",
      Number(cantidad || 0) * Number(valorUnidad || 0)
    );

    setValue(
      "orsValorejecutPlse",
      Number(ejecutado || 0) * Number(valorUnidad || 0)
    );
  }, [cantidad, valorUnidad, ejecutado, setValue]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar plan semanal" : "Crear plan semanal"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código plan semanal"
              {...register("orsIdentifkeyPlse", {
                required: "El código del plan semanal es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPlse}
              helperText={errors.orsIdentifkeyPlse?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Orden de servicio"
              {...register("orsIdentifkeyOrde", {
                required: "La orden es obligatoria"
              })}
              error={!!errors.orsIdentifkeyOrde}
              helperText={errors.orsIdentifkeyOrde?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Plan de trabajo"
              {...register("orsIdentifkeyPltr", {
                required: "El plan de trabajo es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPltr}
              helperText={errors.orsIdentifkeyPltr?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Proyección semanal"
              {...register("orsIdentifkeyPsem")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad programada"
              {...register("orsCantidunidadPlse", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor unidad"
              {...register("orsValorunidadPlse", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor total"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsValortotalPlse", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad ejecutada"
              {...register("orsEjecutunidadPlse", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor ejecutado"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsValorejecutPlse", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistPlse")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregPlse")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}