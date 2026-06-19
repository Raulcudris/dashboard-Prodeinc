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

import { NovedadDto } from "../../types/controlObras.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyNove: string;
  orsIdentifkeyOrde: string;
  orsFechreportNove: string;
  orsTiponovedadNovt: string;
  orsRegistrbaseNove: string;
  orsRegistbaseNove: string;
  orsRegistrnoveNove: string;
  orsEstadoregNove: string;
}

interface NovedadFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: NovedadDto | null;
  onClose: () => void;
  onSubmit: (data: NovedadDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
  orsIdentifkeyNove: "",
  orsIdentifkeyOrde: "",
  orsFechreportNove: "",
  orsTiponovedadNovt: "",
  orsRegistrbaseNove: "",
  orsRegistbaseNove: "",
  orsRegistrnoveNove: "",
  orsEstadoregNove: "1"
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

function mapInitialData(data: NovedadDto): FormValues {
  return {
    orsIdentifkeyNove: data.orsIdentifkeyNove ?? "",
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsFechreportNove: data.orsFechreportNove ?? "",
    orsTiponovedadNovt: data.orsTiponovedadNovt ?? "",
    orsRegistrbaseNove:
      data.orsRegistrbaseNove ?? data.orsRegistbaseNove ?? "",
    orsRegistbaseNove:
      data.orsRegistbaseNove ?? data.orsRegistrbaseNove ?? "",
    orsRegistrnoveNove: data.orsRegistrnoveNove ?? "",
    orsEstadoregNove: normalizeEstadoRegistro(data.orsEstadoregNove)
  };
}

export function NovedadForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: NovedadFormProps) {
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
    const registroBase = normalizeKey(values.orsRegistrbaseNove);
    const referenciaBase = normalizeKey(values.orsRegistbaseNove);

    onSubmit({
      orsPrimarykeyNove: initialData?.orsPrimarykeyNove,
      orsIdentifkeyNove: normalizeKey(values.orsIdentifkeyNove),
      orsIdentifkeyOrde: normalizeKey(values.orsIdentifkeyOrde),
      orsFechreportNove: values.orsFechreportNove || undefined,
      orsTiponovedadNovt: normalizeKey(values.orsTiponovedadNovt) || undefined,
      orsRegistrbaseNove: registroBase || undefined,
      orsRegistbaseNove: referenciaBase || registroBase || undefined,
      orsRegistrnoveNove: normalizeText(values.orsRegistrnoveNove),
      orsEstadoregNove: normalizeEstadoRegistro(
        values.orsEstadoregNove
      ) as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
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
          {initialData ? "Editar novedad" : "Crear novedad"}
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
          Registra situaciones de campo que afecten la ejecución, seguimiento o
          trazabilidad de la obra.
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
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código novedad"
                placeholder="NOVE-0001"
                error={Boolean(errors.orsIdentifkeyNove)}
                helperText={
                  errors.orsIdentifkeyNove?.message ??
                  "Código único de la novedad."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("orsIdentifkeyNove", {
                  required: "El código de la novedad es obligatorio",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "El código de la novedad es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Orden de servicio"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={
                  errors.orsIdentifkeyOrde?.message ??
                  "Código de la orden asociada."
                }
                {...register("orsIdentifkeyOrde", {
                  required: "La orden de servicio es obligatoria",
                  validate: value =>
                    value.trim().length > 0 ||
                    "La orden de servicio es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha novedad"
                error={Boolean(errors.orsFechreportNove)}
                helperText={errors.orsFechreportNove?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
                {...register("orsFechreportNove", {
                  required: "La fecha de la novedad es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Tipo novedad"
                placeholder="ATRASO / CLIMA / EQUIPO / MATERIAL"
                error={Boolean(errors.orsTiponovedadNovt)}
                helperText={
                  errors.orsTiponovedadNovt?.message ??
                  "Clasificación operativa de la novedad."
                }
                {...register("orsTiponovedadNovt", {
                  required: "El tipo de novedad es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El tipo de novedad es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Registro base"
                placeholder="REPORTE_DIARIO / PLAN_SEMANAL"
                helperText="Opcional. Módulo o registro origen de la novedad."
                {...register("orsRegistrbaseNove")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Referencia base"
                placeholder="PDIA-0001 / PLSE-0001"
                helperText="Opcional. Código del registro relacionado."
                {...register("orsRegistbaseNove")}
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
            Descripción de la novedad
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Descripción"
                placeholder="Describe la novedad, impacto, causa, responsable o acción requerida."
                error={Boolean(errors.orsRegistrnoveNove)}
                helperText={errors.orsRegistrnoveNove?.message}
                {...register("orsRegistrnoveNove", {
                  required: "La descripción de la novedad es obligatoria",
                  minLength: {
                    value: 10,
                    message:
                      "La descripción de la novedad debe tener mínimo 10 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "La descripción de la novedad es obligatoria"
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
                name="orsEstadoregNove"
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
            {loading ? "Guardando..." : "Guardar novedad"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}