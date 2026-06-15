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
import { UnidadMedidaDto } from "../../types/equipos.types";

interface UnidadMedidaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: UnidadMedidaDto | null;
  onClose: () => void;
  onSubmit: (data: UnidadMedidaDto) => Promise<void> | void;
}

const defaultValues: UnidadMedidaDto = {
  prvTipunidamedUnme: "",
  prvDescmedidaUnme: "",
  prvEstadoregUnme: "1"
};

export function UnidadMedidaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: UnidadMedidaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UnidadMedidaDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Editar unidad de medida" : "Crear unidad de medida"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código unidad"
              placeholder="HORA, DIA, KM, M3"
              {...register("prvTipunidamedUnme", {
                required: "El código de unidad es obligatorio"
              })}
              error={!!errors.prvTipunidamedUnme}
              helperText={errors.prvTipunidamedUnme?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("prvEstadoregUnme")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descripción"
              {...register("prvDescmedidaUnme", {
                required: "La descripción es obligatoria"
              })}
              error={!!errors.prvDescmedidaUnme}
              helperText={errors.prvDescmedidaUnme?.message}
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