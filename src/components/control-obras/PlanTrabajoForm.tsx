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
import { PlanTrabajoDto } from "../../types/controlObras.types";

interface PlanTrabajoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: PlanTrabajoDto | null;
  onClose: () => void;
  onSubmit: (data: PlanTrabajoDto) => Promise<void> | void;
}

const defaultValues: PlanTrabajoDto = {
  orsIdentifkeyPltr: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPunt: "",
  orsDesactividadPltr: "",
  orsIdentifkeyRseq: "",
  prvIdentifkeyInve: "",
  orsCantidunidadRseq: 0,
  orsValorunidadRseq: 0,
  orsValortotalRseq: 0,
  orsTiporegistPltr: "1",
  orsEstadoregPltr: "1"
};

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
    watch,
    setValue,
    formState: { errors }
  } = useForm<PlanTrabajoDto>({
    defaultValues
  });

  const cantidad = watch("orsCantidunidadRseq");
  const valorUnidad = watch("orsValorunidadRseq");

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  useEffect(() => {
    const total = Number(cantidad || 0) * Number(valorUnidad || 0);
    setValue("orsValortotalRseq", total);
  }, [cantidad, valorUnidad, setValue]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar plan de trabajo" : "Crear plan de trabajo proyectado"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código plan"
              {...register("orsIdentifkeyPltr", {
                required: "El código del plan es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPltr}
              helperText={errors.orsIdentifkeyPltr?.message}
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
              label="Punto / sitio"
              {...register("orsIdentifkeyPunt", {
                required: "El punto es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPunt}
              helperText={errors.orsIdentifkeyPunt?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Resumen equipo"
              {...register("orsIdentifkeyRseq")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Actividad proyectada"
              {...register("orsDesactividadPltr", {
                required: "La actividad es obligatoria"
              })}
              error={!!errors.orsDesactividadPltr}
              helperText={errors.orsDesactividadPltr?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Equipo / maquinaria"
              {...register("prvIdentifkeyInve")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad"
              {...register("orsCantidunidadRseq", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor unidad"
              {...register("orsValorunidadRseq", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor total"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsValortotalRseq", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistPltr")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregPltr")}
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