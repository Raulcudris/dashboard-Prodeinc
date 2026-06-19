"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { UnidadMedidaDto } from "../../types/equipos.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvTipunidamedUnme: string;
  prvDescmedidaUnme: string;
  prvEstadoregUnme: string;
}

interface UnidadMedidaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: UnidadMedidaDto | null;
  onClose: () => void;
  onSubmit: (data: UnidadMedidaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvTipunidamedUnme: "",
  prvDescmedidaUnme: "",
  prvEstadoregUnme: "1"
};

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function mapInitialData(data: UnidadMedidaDto): FormValues {
  return {
    prvTipunidamedUnme: data.prvTipunidamedUnme ?? "",
    prvDescmedidaUnme: data.prvDescmedidaUnme ?? "",
    prvEstadoregUnme: normalizeEstadoRegistro(data.prvEstadoregUnme)
  };
}

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
    control,
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
      prvTipunidamedUnme: normalizeKey(values.prvTipunidamedUnme),
      prvDescmedidaUnme: normalizeText(values.prvDescmedidaUnme),
      prvEstadoregUnme: normalizeEstadoRegistro(
        values.prvEstadoregUnme
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>
        <Box
          component="div"
          sx={{
            m: 0,
            fontSize: "1.25rem",
            fontWeight: 900
          }}
        >
          {initialData ? "Editar unidad de medida" : "Crear unidad de medida"}
        </Box>

        <Box
          component="p"
          sx={{
            m: 0,
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.9rem"
          }}
        >
          Define unidades usadas para medir operación de equipos, maquinaria,
          suministros o actividades de obra.
        </Box>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Información principal
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Código / tipo unidad"
                placeholder="HORA, DIA, KM, M3"
                error={Boolean(errors.prvTipunidamedUnme)}
                helperText={
                  errors.prvTipunidamedUnme?.message ??
                  "Código único de la unidad de medida."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("prvTipunidamedUnme", {
                  required: "El código de la unidad es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El código debe tener mínimo 2 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código de la unidad es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Hora de operación, día trabajado, kilómetro, metro cúbico..."
                error={Boolean(errors.prvDescmedidaUnme)}
                helperText={errors.prvDescmedidaUnme?.message}
                {...register("prvDescmedidaUnme", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 4,
                    message: "La descripción debe tener mínimo 4 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 || "La descripción es obligatoria"
                })}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box
            component="h3"
            sx={{
              m: 0,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 850
            }}
          >
            Control interno
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="prvEstadoregUnme"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estado"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="2">Inactivo</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar unidad"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}