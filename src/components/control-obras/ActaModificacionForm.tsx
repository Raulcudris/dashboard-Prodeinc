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

export interface ActaModificacionFormValues {
  actaKey: string;
  ordenKey: string;
  fechaActa: string;
  causal: string;
  descripcion: string;
  valorAdicion: number;
  valorReduccion: number;
  observacion: string;
  estado: string;
}

interface ActaModificacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ActaModificacionFormValues | null;
  onClose: () => void;
  onSubmit: (data: ActaModificacionFormValues) => Promise<void> | void;
}

const defaultValues: ActaModificacionFormValues = {
  actaKey: "",
  ordenKey: "",
  fechaActa: "",
  causal: "",
  descripcion: "",
  valorAdicion: 0,
  valorReduccion: 0,
  observacion: "",
  estado: "1"
};

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
    formState: { errors }
  } = useForm<ActaModificacionFormValues>({
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
        {initialData ? "Editar acta de modificación" : "Crear acta de modificación"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código acta"
              placeholder="ACTA-0001"
              {...register("actaKey", {
                required: "El código del acta es obligatorio"
              })}
              error={!!errors.actaKey}
              helperText={errors.actaKey?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Orden de servicio"
              placeholder="ORDE-0001"
              {...register("ordenKey", {
                required: "La orden de servicio es obligatoria"
              })}
              error={!!errors.ordenKey}
              helperText={errors.ordenKey?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha acta"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("fechaActa", {
                required: "La fecha del acta es obligatoria"
              })}
              error={!!errors.fechaActa}
              helperText={errors.fechaActa?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("estado")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Causal"
              {...register("causal", {
                required: "La causal es obligatoria"
              })}
              error={!!errors.causal}
              helperText={errors.causal?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Descripción"
              {...register("descripcion")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor adición"
              {...register("valorAdicion", {
                valueAsNumber: true
              })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor reducción"
              {...register("valorReduccion", {
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
              {...register("observacion")}
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