"use client";

import { useEffect } from "react";
import {
  Box,
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
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvIdentifkeyInve: string;
  prvIdentifkeyMprv: string;
  prvTipoequipoTieq: string;
  prvNombrequipoInve: string;
  prvRefermodeloInve: string;
  prvEquipoestadoInve: string;
  prvEquipoactivoInve: string;
  prvEstadoregInve: string;
  prvDescripcionInve: string;
}

interface EquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: EquipoDto | null;
  onClose: () => void;
  onSubmit: (data: EquipoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvIdentifkeyInve: "",
  prvIdentifkeyMprv: "",
  prvTipoequipoTieq: "",
  prvNombrequipoInve: "",
  prvRefermodeloInve: "",
  prvEquipoestadoInve: "",
  prvEquipoactivoInve: "1",
  prvEstadoregInve: "1",
  prvDescripcionInve: ""
};

function mapInitialData(data: EquipoDto): FormValues {
  return {
    prvIdentifkeyInve: data.prvIdentifkeyInve ?? "",
    prvIdentifkeyMprv: data.prvIdentifkeyMprv ?? "",
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",
    prvNombrequipoInve: data.prvNombrequipoInve ?? "",
    prvRefermodeloInve: data.prvRefermodeloInve ?? "",
    prvEquipoestadoInve: data.prvEquipoestadoInve ?? "",
    prvEquipoactivoInve: data.prvEquipoactivoInve ?? "1",
    prvEstadoregInve: data.prvEstadoregInve ?? "1",
    prvDescripcionInve: data.prvDescripcionInve ?? ""
  };
}

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
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      prvPrimarykeyInve: initialData?.prvPrimarykeyInve,
      prvIdentifkeyInve: values.prvIdentifkeyInve.trim().toUpperCase(),
      prvIdentifkeyMprv: values.prvIdentifkeyMprv.trim(),
      prvTipoequipoTieq: values.prvTipoequipoTieq.trim().toUpperCase(),
      prvNombrequipoInve: values.prvNombrequipoInve.trim(),
      prvRefermodeloInve: values.prvRefermodeloInve.trim(),
      prvEquipoestadoInve: values.prvEquipoestadoInve.trim(),
      prvEquipoactivoInve: (values.prvEquipoactivoInve || "1") as EstadoRegistro,
      prvEstadoregInve: (values.prvEstadoregInve || "1") as EstadoRegistro,
      prvDescripcionInve: values.prvDescripcionInve.trim()
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar equipo" : "Crear equipo"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código equipo"
                placeholder="EQ-0001"
                error={Boolean(errors.prvIdentifkeyInve)}
                helperText={errors.prvIdentifkeyInve?.message}
                {...register("prvIdentifkeyInve", {
                  required: "El código del equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Proveedor"
                placeholder="PROV-0001"
                error={Boolean(errors.prvIdentifkeyMprv)}
                helperText={errors.prvIdentifkeyMprv?.message}
                {...register("prvIdentifkeyMprv", {
                  required: "El proveedor es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo equipo"
                placeholder="RETROEXCAVADORA"
                error={Boolean(errors.prvTipoequipoTieq)}
                helperText={errors.prvTipoequipoTieq?.message}
                {...register("prvTipoequipoTieq", {
                  required: "El tipo de equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre equipo"
                placeholder="Retroexcavadora CAT 420"
                error={Boolean(errors.prvNombrequipoInve)}
                helperText={errors.prvNombrequipoInve?.message}
                {...register("prvNombrequipoInve", {
                  required: "El nombre del equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Referencia / modelo"
                placeholder="CAT 420F2"
                {...register("prvRefermodeloInve")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Estado operativo"
                placeholder="OPERATIVO, MANTENIMIENTO, FUERA_SERVICIO"
                {...register("prvEquipoestadoInve")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Disponible"
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

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}