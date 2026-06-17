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
import { ReporteOperacionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyRope: string;
  orsIdentifkeyOrde: string;
  orsFechareportRope: string;
  orsObservacionRope: string;
  orsTiporegistRope: string;
  orsEstadoregRope: string;
}

interface ReporteOperacionFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReporteOperacionDto | null;
  onClose: () => void;
  onSubmit: (data: ReporteOperacionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyRope: "",
  orsIdentifkeyOrde: "",
  orsFechareportRope: "",
  orsObservacionRope: "",
  orsTiporegistRope: "1",
  orsEstadoregRope: "1"
};

function mapInitialData(data: ReporteOperacionDto): FormValues {
  return {
    orsIdentifkeyRope: data.orsIdentifkeyRope ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsFechareportRope: data.orsFechareportRope ?? "",
    orsObservacionRope: data.orsObservacionRope ?? "",
    orsTiporegistRope: data.orsTiporegistRope ?? "1",
    orsEstadoregRope: data.orsEstadoregRope ?? "1"
  };
}

export function ReporteOperacionForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ReporteOperacionFormProps) {
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
      orsPrimarykeyRope: initialData?.orsPrimarykeyRope,
      orsIdentifkeyRope: values.orsIdentifkeyRope.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsFechareportRope: values.orsFechareportRope,
      orsObservacionRope: values.orsObservacionRope.trim(),
      orsTiporegistRope: values.orsTiporegistRope || "1",
      orsEstadoregRope: (values.orsEstadoregRope || "1") as EstadoRegistro
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
        {initialData
          ? "Editar reporte de operación"
          : "Crear reporte de operación"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Código reporte"
                placeholder="ROPE-0001"
                error={Boolean(errors.orsIdentifkeyRope)}
                helperText={errors.orsIdentifkeyRope?.message}
                {...register("orsIdentifkeyRope", {
                  required: "El código del reporte es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
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
                error={Boolean(errors.orsFechareportRope)}
                helperText={errors.orsFechareportRope?.message}
                {...register("orsFechareportRope", {
                  required: "La fecha del reporte es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistRope")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregRope")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Observación"
                {...register("orsObservacionRope")}
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