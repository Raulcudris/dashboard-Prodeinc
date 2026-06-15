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
import { ReporteDiarioDto } from "../../types/controlObras.types";

interface ReporteDiarioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteDiarioDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteDiarioDto) => Promise<void> | void;
}

const defaultValues: ReporteDiarioDto = {
  orsIdentifkeyPdia: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPsem: "",
  orsObservacionPdia: "",
  orsFechareportPdia: "",
  orsEjecutunidadPdia: 0,
  orsTiporegistPdia: "1",
  orsEstadoregPdia: "1"
};

export function ReporteDiarioForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ReporteDiarioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReporteDiarioDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar reporte diario" : "Crear reporte diario"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código reporte diario"
              {...register("orsIdentifkeyPdia", {
                required: "El código del reporte es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPdia}
              helperText={errors.orsIdentifkeyPdia?.message}
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
              label="Plan semanal"
              {...register("orsIdentifkeyPlse", {
                required: "El plan semanal es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPlse}
              helperText={errors.orsIdentifkeyPlse?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Proyección semanal"
              {...register("orsIdentifkeyPsem")}
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
              {...register("orsFechareportPdia", {
                required: "La fecha del reporte es obligatoria"
              })}
              error={!!errors.orsFechareportPdia}
              helperText={errors.orsFechareportPdia?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Cantidad ejecutada"
              {...register("orsEjecutunidadPdia", {
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
              {...register("orsObservacionPdia")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistPdia")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregPdia")}
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