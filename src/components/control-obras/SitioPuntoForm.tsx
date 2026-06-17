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

import { SitioPuntoDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPunt: string;
  orsIdentifkeyOrde: string;
  orsNombresitioPunt: string;
  sisCodproSipr: string;
  orsGeolatitudePunt: number | "";
  orsGeolongitudePunt: number | "";
  orsPathimagenPunt: string;
  orsTiporegistPunt: string;
  orsEstadoregPunt: string;
}

interface SitioPuntoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: SitioPuntoDto | null;
  onClose: () => void;
  onSubmit: (data: SitioPuntoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPunt: "",
  orsIdentifkeyOrde: "",
  orsNombresitioPunt: "",
  sisCodproSipr: "",
  orsGeolatitudePunt: "",
  orsGeolongitudePunt: "",
  orsPathimagenPunt: "",
  orsTiporegistPunt: "1",
  orsEstadoregPunt: "1"
};

function mapInitialData(data: SitioPuntoDto): FormValues {
  return {
    orsIdentifkeyPunt: data.orsIdentifkeyPunt ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsNombresitioPunt: data.orsNombresitioPunt ?? "",
    sisCodproSipr: data.sisCodproSipr ?? "",
    orsGeolatitudePunt:
      typeof data.orsGeolatitudePunt === "number"
        ? data.orsGeolatitudePunt
        : data.orsGeolatitudePunt
          ? Number(data.orsGeolatitudePunt)
          : "",
    orsGeolongitudePunt:
      typeof data.orsGeolongitudePunt === "number"
        ? data.orsGeolongitudePunt
        : data.orsGeolongitudePunt
          ? Number(data.orsGeolongitudePunt)
          : "",
    orsPathimagenPunt: data.orsPathimagenPunt ?? "",
    orsTiporegistPunt: data.orsTiporegistPunt ?? "1",
    orsEstadoregPunt: data.orsEstadoregPunt ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

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
      orsPrimarykeyPunt: initialData?.orsPrimarykeyPunt,
      orsIdentifkeyPunt: values.orsIdentifkeyPunt.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsNombresitioPunt: values.orsNombresitioPunt.trim(),
      sisCodproSipr: values.sisCodproSipr.trim(),
      orsGeolatitudePunt: toOptionalNumber(values.orsGeolatitudePunt),
      orsGeolongitudePunt: toOptionalNumber(values.orsGeolongitudePunt),
      orsPathimagenPunt: values.orsPathimagenPunt.trim(),
      orsTiporegistPunt: values.orsTiporegistPunt || "1",
      orsEstadoregPunt: (values.orsEstadoregPunt || "1") as EstadoRegistro
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
        {initialData ? "Editar sitio o punto" : "Crear sitio o punto"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código sitio"
                placeholder="PUNT-0001"
                error={Boolean(errors.orsIdentifkeyPunt)}
                helperText={errors.orsIdentifkeyPunt?.message}
                {...register("orsIdentifkeyPunt", {
                  required: "El código del sitio es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={errors.orsIdentifkeyOrde?.message}
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código proyecto"
                placeholder="PROY-0001"
                {...register("sisCodproSipr")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nombre del sitio"
                error={Boolean(errors.orsNombresitioPunt)}
                helperText={errors.orsNombresitioPunt?.message}
                {...register("orsNombresitioPunt", {
                  required: "El nombre del sitio es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitud"
                {...register("orsGeolatitudePunt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitud"
                {...register("orsGeolongitudePunt", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Ruta imagen / evidencia"
                placeholder="URL o ruta del archivo"
                {...register("orsPathimagenPunt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistPunt")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregPunt")}
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