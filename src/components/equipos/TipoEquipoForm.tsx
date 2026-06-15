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
import { TipoEquipoDto } from "../../types/equipos.types";

interface TipoEquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: TipoEquipoDto | null;
  onClose: () => void;
  onSubmit: (data: TipoEquipoDto) => Promise<void> | void;
}

const defaultValues: TipoEquipoDto = {
  prvTipoequipoTieq: "",
  prvIdentifkeyUnme: "",
  prvDescripcionTieq: "",
  prvTiporegistTieq: "1",
  prvEstadoregTieq: "1"
};

export function TipoEquipoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: TipoEquipoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TipoEquipoDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Editar tipo de equipo" : "Crear tipo de equipo"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código tipo equipo"
              placeholder="EXC, VOL, COM"
              {...register("prvTipoequipoTieq", {
                required: "El código del tipo de equipo es obligatorio"
              })}
              error={!!errors.prvTipoequipoTieq}
              helperText={errors.prvTipoequipoTieq?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Unidad de medida"
              placeholder="HORA, DIA, KM"
              {...register("prvIdentifkeyUnme", {
                required: "La unidad de medida es obligatoria"
              })}
              error={!!errors.prvIdentifkeyUnme}
              helperText={errors.prvIdentifkeyUnme?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Descripción"
              {...register("prvDescripcionTieq", {
                required: "La descripción es obligatoria"
              })}
              error={!!errors.prvDescripcionTieq}
              helperText={errors.prvDescripcionTieq?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("prvTiporegistTieq")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("prvEstadoregTieq")}
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