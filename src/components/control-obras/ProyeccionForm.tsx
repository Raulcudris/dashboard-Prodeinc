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
import { ProyeccionDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyPsem: string;
  orsIdentifkeyOrde: string;
  orsNumsemanaPsem: number | "";
  orsFechainicioPsem: string;
  orsFechafinPsem: string;
  orsDescripcionPsem: string;
  orsTiporegistPsem: string;
  orsEstadoregPsem: string;
}

interface ProyeccionSemanalFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ProyeccionDto | null;
  onClose: () => void;
  onSubmit: (data: ProyeccionDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyPsem: "",
  orsIdentifkeyOrde: "",
  orsNumsemanaPsem: "",
  orsFechainicioPsem: "",
  orsFechafinPsem: "",
  orsDescripcionPsem: "",
  orsTiporegistPsem: "1",
  orsEstadoregPsem: "1"
};

function mapInitialData(data: ProyeccionDto): FormValues {
  return {
    orsIdentifkeyPsem: data.orsIdentifkeyPsem ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsNumsemanaPsem:
      typeof data.orsNumsemanaPsem === "number" ? data.orsNumsemanaPsem : "",
    orsFechainicioPsem: data.orsFechainicioPsem ?? "",
    orsFechafinPsem: data.orsFechafinPsem ?? "",
    orsDescripcionPsem: data.orsDescripcionPsem ?? "",
    orsTiporegistPsem: data.orsTiporegistPsem ?? "1",
    orsEstadoregPsem: data.orsEstadoregPsem ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

export function ProyeccionSemanalForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: ProyeccionSemanalFormProps) {
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
      orsPrimarykeyPsem: initialData?.orsPrimarykeyPsem,
      orsIdentifkeyPsem: values.orsIdentifkeyPsem.trim().toUpperCase(),
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim(),
      orsNumsemanaPsem: toOptionalNumber(values.orsNumsemanaPsem),
      orsFechainicioPsem: values.orsFechainicioPsem,
      orsFechafinPsem: values.orsFechafinPsem,
      orsDescripcionPsem: values.orsDescripcionPsem.trim(),
      orsTiporegistPsem: values.orsTiporegistPsem || "1",
      orsEstadoregPsem: (values.orsEstadoregPsem || "1") as EstadoRegistro
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
          ? "Editar proyección semanal"
          : "Crear proyección semanal"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código proyección"
                placeholder="PSEM-0001"
                error={Boolean(errors.orsIdentifkeyPsem)}
                helperText={errors.orsIdentifkeyPsem?.message}
                {...register("orsIdentifkeyPsem", {
                  required: "El código de la proyección es obligatorio"
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
                type="number"
                label="Número semana"
                error={Boolean(errors.orsNumsemanaPsem)}
                helperText={errors.orsNumsemanaPsem?.message}
                {...register("orsNumsemanaPsem", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechainicioPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha fin"
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechafinPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                {...register("orsDescripcionPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistPsem")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregPsem")}
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