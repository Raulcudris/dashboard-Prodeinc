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

import { TipoEvidenciaDto } from "../../types/evidencias.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  eviIdentifkeyTiev: string;
  eviDescripcionTiev: string;
  eviTiporegistTiev: string;
  eviEstadoregTiev: string;
}

interface TipoEvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: TipoEvidenciaDto | null;
  onClose: () => void;
  onSubmit: (data: TipoEvidenciaDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  eviIdentifkeyTiev: "",
  eviDescripcionTiev: "",
  eviTiporegistTiev: "1",
  eviEstadoregTiev: "1"
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

function mapInitialData(data: TipoEvidenciaDto): FormValues {
  return {
    eviIdentifkeyTiev: data.eviIdentifkeyTiev ?? "",
    eviDescripcionTiev: data.eviDescripcionTiev ?? "",
    eviTiporegistTiev: normalizeTipoRegistro(data.eviTiporegistTiev),
    eviEstadoregTiev: normalizeEstadoRegistro(data.eviEstadoregTiev)
  };
}

export function TipoEvidenciaForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: TipoEvidenciaFormProps) {
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
      eviPrimarykeyTiev: initialData?.eviPrimarykeyTiev,
      eviIdentifkeyTiev: normalizeKey(values.eviIdentifkeyTiev),
      eviDescripcionTiev: normalizeText(values.eviDescripcionTiev),
      eviTiporegistTiev: normalizeTipoRegistro(values.eviTiporegistTiev),
      eviEstadoregTiev: normalizeEstadoRegistro(
        values.eviEstadoregTiev
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
          {initialData ? "Editar tipo de evidencia" : "Crear tipo de evidencia"}
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
          Clasifica fotos, documentos, videos y soportes asociados a registros
          de obra.
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
                label="Código tipo evidencia"
                placeholder="TIEV-0001"
                error={Boolean(errors.eviIdentifkeyTiev)}
                helperText={
                  errors.eviIdentifkeyTiev?.message ??
                  "Código único del tipo de evidencia."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("eviIdentifkeyTiev", {
                  required: "El código del tipo de evidencia es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código del tipo de evidencia es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                placeholder="Ejemplo: Foto de avance, acta firmada, soporte documental, video de inspección."
                error={Boolean(errors.eviDescripcionTiev)}
                helperText={errors.eviDescripcionTiev?.message}
                {...register("eviDescripcionTiev", {
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="eviTiporegistTiev"
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
                name="eviEstadoregTiev"
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