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

import {
  ReferenciaEvidenciaDto,
  TipoRegistroEvidencia
} from "../../types/evidencias.types";
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  eviIdentifkeyRefe: string;
  eviIdentifkeyEvid: string;
  eviTiporegistroRefe: string;
  eviIdentifregistroRefe: string;
  eviObservacionRefe: string;
  eviTiporegistRefe: string;
  eviEstadoregRefe: string;
}

interface ReferenciaEvidenciaFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: ReferenciaEvidenciaDto | null;
  evidenciaKeyDefault?: string;
  registroKeyDefault?: string;
  tipoRegistroDefault?: TipoRegistroEvidencia | string;
  onClose: () => void;
  onSubmit: (data: ReferenciaEvidenciaDto) => Promise<void> | void;
}

const tipoRegistroOptions: Array<{
  value: TipoRegistroEvidencia;
  label: string;
}> = [
  {
    value: "REPORTE_OPERACION",
    label: "Reporte de operación"
  },
  {
    value: "NOVEDAD",
    label: "Novedad"
  },
  {
    value: "DETALLE_EQUIPO_OPERACION",
    label: "Detalle equipo operación"
  },
  {
    value: "INFORME_SEMANAL",
    label: "Informe semanal"
  },
  {
    value: "ACTA_MODIFICACION",
    label: "Acta de modificación"
  },
  {
    value: "DETALLE_ACTA_MODIFICACION",
    label: "Detalle acta modificación"
  },
  {
    value: "ORDEN_SERVICIO",
    label: "Orden de servicio"
  },
  {
    value: "SITIO_PUNTO",
    label: "Sitio / punto"
  },
  {
    value: "PLAN_TRABAJO",
    label: "Plan de trabajo"
  },
  {
    value: "PLAN_SEMANAL",
    label: "Plan semanal"
  }
];

const emptyValues: FormValues = {
  eviIdentifkeyRefe: "",
  eviIdentifkeyEvid: "",
  eviTiporegistroRefe: "REPORTE_OPERACION",
  eviIdentifregistroRefe: "",
  eviObservacionRefe: "",
  eviTiporegistRefe: "1",
  eviEstadoregRefe: "1"
};

function buildReferenceKey() {
  return `REFE-${Date.now().toString().slice(-6)}`;
}

function normalizeTipoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2", "3"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeEstadoRegistro(value?: string) {
  const normalizedValue = String(value ?? "1");

  return ["1", "2"].includes(normalizedValue) ? normalizedValue : "1";
}

function normalizeTipoRegistroEvidencia(value?: string) {
  const normalizedValue = String(value ?? "REPORTE_OPERACION");

  const exists = tipoRegistroOptions.some(
    option => option.value === normalizedValue
  );

  return exists ? normalizedValue : "REPORTE_OPERACION";
}

function normalizeKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeText(value: string) {
  return value.trim();
}

function buildCreateValues(
  evidenciaKeyDefault: string,
  registroKeyDefault: string,
  tipoRegistroDefault: TipoRegistroEvidencia | string
): FormValues {
  return {
    eviIdentifkeyRefe: buildReferenceKey(),
    eviIdentifkeyEvid: evidenciaKeyDefault,
    eviTiporegistroRefe: normalizeTipoRegistroEvidencia(tipoRegistroDefault),
    eviIdentifregistroRefe: registroKeyDefault,
    eviObservacionRefe: "",
    eviTiporegistRefe: "1",
    eviEstadoregRefe: "1"
  };
}

function mapInitialData(data: ReferenciaEvidenciaDto): FormValues {
  return {
    eviIdentifkeyRefe: data.eviIdentifkeyRefe ?? "",
    eviIdentifkeyEvid: data.eviIdentifkeyEvid ?? "",
    eviTiporegistroRefe: normalizeTipoRegistroEvidencia(
      data.eviTiporegistroRefe
    ),
    eviIdentifregistroRefe: data.eviIdentifregistroRefe ?? "",
    eviObservacionRefe: data.eviObservacionRefe ?? "",
    eviTiporegistRefe: normalizeTipoRegistro(data.eviTiporegistRefe),
    eviEstadoregRefe: normalizeEstadoRegistro(data.eviEstadoregRefe)
  };
}

export function ReferenciaEvidenciaForm({
  open,
  loading = false,
  initialData,
  evidenciaKeyDefault = "",
  registroKeyDefault = "",
  tipoRegistroDefault = "REPORTE_OPERACION",
  onClose,
  onSubmit
}: ReferenciaEvidenciaFormProps) {
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

    reset(
      buildCreateValues(
        evidenciaKeyDefault,
        registroKeyDefault,
        tipoRegistroDefault
      )
    );
  }, [
    open,
    initialData,
    evidenciaKeyDefault,
    registroKeyDefault,
    tipoRegistroDefault,
    reset
  ]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      eviPrimarykeyRefe: initialData?.eviPrimarykeyRefe,
      eviIdentifkeyRefe: normalizeKey(values.eviIdentifkeyRefe),
      eviIdentifkeyEvid: normalizeKey(values.eviIdentifkeyEvid),
      eviTiporegistroRefe: normalizeTipoRegistroEvidencia(
        values.eviTiporegistroRefe
      ),
      eviIdentifregistroRefe: normalizeKey(values.eviIdentifregistroRefe),
      eviObservacionRefe: normalizeText(values.eviObservacionRefe) || undefined,
      eviTiporegistRefe: normalizeTipoRegistro(values.eviTiporegistRefe),
      eviEstadoregRefe: normalizeEstadoRegistro(
        values.eviEstadoregRefe
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
          {initialData
            ? "Editar referencia de evidencia"
            : "Crear referencia de evidencia"}
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
          Relaciona una evidencia con el registro de obra correspondiente:
          reporte, novedad, orden, sitio, plan o acta.
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
            Relación de evidencia
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Código referencia"
                placeholder="REFE-0001"
                fullWidth
                error={Boolean(errors.eviIdentifkeyRefe)}
                helperText={
                  errors.eviIdentifkeyRefe?.message ??
                  "Código único de la referencia."
                }
                slotProps={{
                  input: {
                    readOnly: Boolean(initialData)
                  }
                }}
                {...register("eviIdentifkeyRefe", {
                  required: "La referencia es obligatoria",
                  minLength: {
                    value: 3,
                    message: "El código debe tener mínimo 3 caracteres"
                  },
                  validate: value =>
                    value.trim().length > 0 ||
                    "La referencia es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Código evidencia"
                placeholder="EVID-0001"
                fullWidth
                error={Boolean(errors.eviIdentifkeyEvid)}
                helperText={
                  errors.eviIdentifkeyEvid?.message ??
                  "Código de la evidencia relacionada."
                }
                {...register("eviIdentifkeyEvid", {
                  required: "La evidencia es obligatoria",
                  validate: value =>
                    value.trim().length > 0 || "La evidencia es obligatoria"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="eviTiporegistroRefe"
                control={control}
                defaultValue="REPORTE_OPERACION"
                rules={{
                  required: "El tipo de registro es obligatorio"
                }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Tipo registro relacionado"
                    value={field.value ?? "REPORTE_OPERACION"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    error={Boolean(errors.eviTiporegistroRefe)}
                    helperText={
                      errors.eviTiporegistroRefe?.message ??
                      "Módulo o entidad a la que pertenece la evidencia."
                    }
                  >
                    {tipoRegistroOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Código registro relacionado"
                placeholder="PDIA-0001 / NOVE-0001 / ORDE-0001"
                fullWidth
                error={Boolean(errors.eviIdentifregistroRefe)}
                helperText={
                  errors.eviIdentifregistroRefe?.message ??
                  "Código del registro específico relacionado."
                }
                {...register("eviIdentifregistroRefe", {
                  required: "El registro relacionado es obligatorio",
                  validate: value =>
                    value.trim().length > 0 ||
                    "El registro relacionado es obligatorio"
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
            Observación
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Observación"
                fullWidth
                multiline
                minRows={3}
                placeholder="Describe el contexto de la relación entre la evidencia y el registro de obra."
                error={Boolean(errors.eviObservacionRefe)}
                helperText={errors.eviObservacionRefe?.message}
                {...register("eviObservacionRefe", {
                  minLength: {
                    value: 5,
                    message: "La observación debe tener mínimo 5 caracteres"
                  }
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
                name="eviTiporegistRefe"
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
                name="eviEstadoregRefe"
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
            {loading ? "Guardando..." : "Guardar referencia"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}