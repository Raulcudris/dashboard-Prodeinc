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
import { SitioPuntoDto } from "../../types/controlObras.types";

interface SitioPuntoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: SitioPuntoDto | null;
  onClose: () => void;
  onSubmit: (data: SitioPuntoDto) => Promise<void> | void;
}

const defaultValues: SitioPuntoDto = {
  orsIdentifkeyPunt: "",
  orsIdentifkeyOrde: "",
  orsNombresitioPunt: "",
  sisCodproSipr: "",
  orsGeolatitudePunt: undefined,
  orsGeolongitudePunt: undefined,
  orsPathimagenPunt: "",
  orsTiporegistPunt: "1",
  orsEstadoregPunt: "1"
};

export function SitioPuntoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: SitioPuntoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SitioPuntoDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar sitio / punto" : "Crear sitio / punto"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código punto"
              {...register("orsIdentifkeyPunt", {
                required: "El código del punto es obligatorio"
              })}
              error={!!errors.orsIdentifkeyPunt}
              helperText={errors.orsIdentifkeyPunt?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Orden de servicio"
              {...register("orsIdentifkeyOrde", {
                required: "La orden de servicio es obligatoria"
              })}
              error={!!errors.orsIdentifkeyOrde}
              helperText={errors.orsIdentifkeyOrde?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Nombre del sitio"
              {...register("orsNombresitioPunt", {
                required: "El nombre del sitio es obligatorio"
              })}
              error={!!errors.orsNombresitioPunt}
              helperText={errors.orsNombresitioPunt?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Municipio / código geográfico"
              {...register("sisCodproSipr")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Latitud"
              {...register("orsGeolatitudePunt", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Longitud"
              {...register("orsGeolongitudePunt", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="URL / ruta imagen"
              {...register("orsPathimagenPunt")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistPunt")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregPunt")}
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