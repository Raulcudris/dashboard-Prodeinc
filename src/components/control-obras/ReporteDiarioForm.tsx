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

import { ReporteDiarioDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPdia: string;
  orsIdentifkeyOrde: string;
  orsIdentifkeyPlse: string;
  orsIdentifkeyPsem: string;
  orsObservacionPdia: string;
  orsFechareportPdia: string;
  orsEjecutunidadPdia: number | "";
  orsTiporegistPdia: string;
  orsEstadoregPdia: string;
}

interface ReporteDiarioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteDiarioDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteDiarioDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPdia: "",
  orsIdentifkeyOrde: "",
  orsIdentifkeyPlse: "",
  orsIdentifkeyPsem: "",
  orsObservacionPdia: "",
  orsFechareportPdia: "",
  orsEjecutunidadPdia: "",
  orsTiporegistPdia: "1",
  orsEstadoregPdia: "1"
};

function mapInitialData(data: ReporteDiarioDto): FormValues {
  return {
    orsIdentifkeyPdia: data.orsIdentifkeyPdia ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsIdentifkeyPlse: data.orsIdentifkeyPlse ?? "",
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsObservacionPdia: data.orsObservacionPdia ?? "",
    orsFechareportPdia: data.orsFechareportPdia ?? "",
    orsEjecutunidadPdia:
      typeof data.orsEjecutunidadPdia === "number"
        ? data.orsEjecutunidadPdia
        : "",
    orsTiporegistPdia: data.orsTiporegistPdia ?? "1",
    orsEstadoregPdia: data.orsEstadoregPdia ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

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
      orsPrimarykeyPdia: initialData?.orsPrimarykeyPdia,
      orsIdentifkeyPdia: values.orsIdentifkeyPdia.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsIdentifkeyPlse: values.orsIdentifkeyPlse.trim(),
      orsIdentifkeyPsem: values.orsIdentifkeyPsem.trim(),
      orsObservacionPdia: values.orsObservacionPdia.trim(),
      orsFechareportPdia: values.orsFechareportPdia,
      orsEjecutunidadPdia: toOptionalNumber(values.orsEjecutunidadPdia),
      orsTiporegistPdia: values.orsTiporegistPdia || "1",
      orsEstadoregPdia: (values.orsEstadoregPdia || "1") as EstadoRegistro
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
        {initialData ? "Editar reporte diario" : "Crear reporte diario"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código reporte diario"
                placeholder="PDIA-0001"
                error={Boolean(errors.orsIdentifkeyPdia)}
                helperText={errors.orsIdentifkeyPdia?.message}
                {...register("orsIdentifkeyPdia", {
                  required: "El código del reporte es obligatorio"
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
                label="Plan semanal"
                placeholder="PLSE-0001"
                error={Boolean(errors.orsIdentifkeyPlse)}
                helperText={errors.orsIdentifkeyPlse?.message}
                {...register("orsIdentifkeyPlse", {
                  required: "El plan semanal es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Proyección semanal"
                placeholder="PSEM-0001"
                {...register("orsIdentifkeyPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha reporte"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechareportPdia")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistPdia")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregPdia")}
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