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
import { DetalleEquipoOperacionDto } from "../../types/controlObras.types";

interface DetalleEquipoOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: DetalleEquipoOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: DetalleEquipoOperacionDto) => Promise<void> | void;
}

const defaultValues: DetalleEquipoOperacionDto = {
  orsIdentifkeyDeop: "",
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  prvIdentifkeyInve: "",
  orsEstadoregDeop: "1"
};

export function DetalleEquipoOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: DetalleEquipoOperacionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DetalleEquipoOperacionDto>({
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
        {initialData
          ? "Editar detalle equipo operación"
          : "Crear detalle equipo operación"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código detalle"
              placeholder="DEOP-0001"
              {...register("orsIdentifkeyDeop", {
                required: "El código del detalle es obligatorio"
              })}
              error={!!errors.orsIdentifkeyDeop}
              helperText={errors.orsIdentifkeyDeop?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reporte operación"
              placeholder="ROPE-0001"
              {...register("orsIdentifkeyRope", {
                required: "El reporte de operación es obligatorio"
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
              label="Equipo / maquinaria"
              placeholder="EQ-0001"
              {...register("prvIdentifkeyInve", {
                required: "El equipo es obligatorio"
              })}
              error={!!errors.prvIdentifkeyInve}
              helperText={errors.prvIdentifkeyInve?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado registro"
              placeholder="1"
              {...register("orsEstadoregDeop")}
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