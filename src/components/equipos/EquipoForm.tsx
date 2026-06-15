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
import { EquipoDto } from "../../types/equipos.types";

interface EquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EquipoDto | null;
  onClose: () => void;
  onSubmit: (data: EquipoDto) => Promise<void> | void;
}

const defaultValues: EquipoDto = {
  prvIdentifkeyInve: "",
  prvIdentifkeyMprv: "",
  prvTipoequipoTieq: "",
  prvNombrequipoInve: "",
  prvRefermodeloInve: "",
  prvEquipoestadoInve: "OPE",
  prvEquipoactivoInve: "1",
  prvEstadoregInve: "1",
  prvDescripcionInve: ""
};

export function EquipoForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: EquipoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EquipoDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar equipo / maquinaria" : "Crear equipo / maquinaria"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Código equipo"
              placeholder="EQ-0001"
              {...register("prvIdentifkeyInve", {
                required: "El código del equipo es obligatorio"
              })}
              error={!!errors.prvIdentifkeyInve}
              helperText={errors.prvIdentifkeyInve?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Proveedor"
              placeholder="PRV-0001"
              {...register("prvIdentifkeyMprv", {
                required: "El proveedor es obligatorio"
              })}
              error={!!errors.prvIdentifkeyMprv}
              helperText={errors.prvIdentifkeyMprv?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Tipo equipo"
              placeholder="EXC"
              {...register("prvTipoequipoTieq", {
                required: "El tipo de equipo es obligatorio"
              })}
              error={!!errors.prvTipoequipoTieq}
              helperText={errors.prvTipoequipoTieq?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Nombre equipo"
              {...register("prvNombrequipoInve", {
                required: "El nombre del equipo es obligatorio"
              })}
              error={!!errors.prvNombrequipoInve}
              helperText={errors.prvNombrequipoInve?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Referencia / modelo"
              placeholder="CAT 320"
              {...register("prvRefermodeloInve")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Estado operativo"
              placeholder="OPE"
              {...register("prvEquipoestadoInve")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Disponible / activo"
              placeholder="1"
              {...register("prvEquipoactivoInve")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Estado registro"
              placeholder="1"
              {...register("prvEstadoregInve")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Descripción"
              {...register("prvDescripcionInve")}
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