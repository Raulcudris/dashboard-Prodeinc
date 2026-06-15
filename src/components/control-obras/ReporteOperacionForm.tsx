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
import { ReporteOperacionDto } from "../../types/controlObras.types";

interface ReporteOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteOperacionDto) => Promise<void> | void;
}

const defaultValues: ReporteOperacionDto = {
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  orsFechareportRope: "",
  orsObservacionRope: "",
  orsTiporegistRope: "1",
  orsEstadoregRope: "1"
};

export function ReporteOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ReporteOperacionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReporteOperacionDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar reporte de operación" : "Crear reporte de operación"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código reporte operación"
              placeholder="ROPE-0001"
              {...register("orsIdentifkeyRope", {
                required: "El código del reporte es obligatorio"
              })}
              error={!!errors.orsIdentifkeyRope}
              helperText={errors.orsIdentifkeyRope?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Orden de servicio"
              placeholder="ORDE-0001"
              {...register("orsIdentifkeyOrde", {
                required: "La orden de servicio es obligatoria"
              })}
              error={!!errors.orsIdentifkeyOrde}
              helperText={errors.orsIdentifkeyOrde?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha reporte"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsFechareportRope")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistRope")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregRope")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Observación"
              {...register("orsObservacionRope")}
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