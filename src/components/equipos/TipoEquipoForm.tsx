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

import { TipoEquipoDto } from "../../types/equipos.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  prvTipoequipoTieq: string;
  prvDescripcionTieq: string;
  prvIdentifkeyUnme: string;
  prvTiporegistTieq: string;
  prvEstadoregTieq: string;
}

interface TipoEquipoFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: TipoEquipoDto | null;
  onClose: () => void;
  onSubmit: (data: TipoEquipoDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  prvTipoequipoTieq: "",
  prvDescripcionTieq: "",
  prvIdentifkeyUnme: "",
  prvTiporegistTieq: "1",
  prvEstadoregTieq: "1"
};

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

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

function mapInitialData(data: TipoEquipoDto): FormValues {
  return {
    prvTipoequipoTieq: data.prvTipoequipoTieq ?? "",
    prvDescripcionTieq: data.prvDescripcionTieq ?? "",
    prvIdentifkeyUnme: data.prvIdentifkeyUnme ?? "",
    prvTiporegistTieq: normalizeTipoRegistro(data.prvTiporegistTieq),
    prvEstadoregTieq: normalizeEstadoRegistro(data.prvEstadoregTieq)
  };
}

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
      prvPrimarykeyTieq: initialData?.prvPrimarykeyTieq,
      prvTipoequipoTieq: normalizeKey(values.prvTipoequipoTieq),
      prvDescripcionTieq: normalizeText(values.prvDescripcionTieq),
      prvIdentifkeyUnme: normalizeKey(values.prvIdentifkeyUnme),
      prvTiporegistTieq: normalizeTipoRegistro(values.prvTiporegistTieq),
      prvEstadoregTieq: normalizeEstadoRegistro(
        values.prvEstadoregTieq
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
          {initialData ? "Editar tipo de equipo" : "Crear tipo de equipo"}
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
          Clasifica maquinaria, vehículos, herramientas y equipos usados en la
          operación de obra.
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
                label="Tipo equipo"
                placeholder="RETROEXCAVADORA, VOLQUETA, CAMIONETA"
                error={Boolean(errors.prvTipoequipoTieq)}
                helperText={
                  errors.prvTipoequipoTieq?.message ??
                  "Código único del tipo de equipo."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("prvTipoequipoTieq", {
                  required: "El tipo de equipo es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El tipo de equipo debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El tipo de equipo es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Descripción del tipo de equipo o maquinaria."
                error={Boolean(errors.prvDescripcionTieq)}
                helperText={errors.prvDescripcionTieq?.message}
                {...register("prvDescripcionTieq", {
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

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Unidad de medida"
                placeholder="HORA, DIA, KM"
                error={Boolean(errors.prvIdentifkeyUnme)}
                helperText={
                  errors.prvIdentifkeyUnme?.message ??
                  "Código de la unidad de medida asociada."
                }
                {...register("prvIdentifkeyUnme", {
                  required: "La unidad de medida es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La unidad de medida es obligatoria"
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="prvTiporegistTieq"
                control={control}
                defaultValue="1"
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Tipo registro interno"
                    value={field.value ?? "1"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                  >
                    <MenuItem value="1">Principal</MenuItem>
                    <MenuItem value="2">Ajuste</MenuItem>
                    <MenuItem value="3">Histórico</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="prvEstadoregTieq"
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
            {loading ? "Guardando..." : "Guardar tipo"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}