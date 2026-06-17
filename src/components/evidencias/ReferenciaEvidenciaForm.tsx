"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  ReferenciaEvidenciaDto,
  TipoRegistroEvidencia
} from "../../types/evidencias.types";
import { EstadoRegistro } from "@/types/common.types";

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

function buildCreateValues(
  evidenciaKeyDefault: string,
  registroKeyDefault: string,
  tipoRegistroDefault: TipoRegistroEvidencia | string
): FormValues {
  return {
    eviIdentifkeyRefe: buildReferenceKey(),
    eviIdentifkeyEvid: evidenciaKeyDefault,
    eviTiporegistroRefe: tipoRegistroDefault || "REPORTE_OPERACION",
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
    eviTiporegistroRefe: data.eviTiporegistroRefe ?? "REPORTE_OPERACION",
    eviIdentifregistroRefe: data.eviIdentifregistroRefe ?? "",
    eviObservacionRefe: data.eviObservacionRefe ?? "",
    eviTiporegistRefe: data.eviTiporegistRefe ?? "1",
    eviEstadoregRefe: data.eviEstadoregRefe ?? "1"
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
    eviIdentifkeyRefe: values.eviIdentifkeyRefe,
    eviIdentifkeyEvid: values.eviIdentifkeyEvid,
    eviTiporegistroRefe: values.eviTiporegistroRefe,
    eviIdentifregistroRefe: values.eviIdentifregistroRefe,
    eviObservacionRefe: values.eviObservacionRefe,
    eviTiporegistRefe: values.eviTiporegistRefe || "1",
    eviEstadoregRefe: (values.eviEstadoregRefe || "1") as EstadoRegistro
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
          ? "Editar referencia de evidencia"
          : "Crear referencia de evidencia"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr"
              },
              gap: 2
            }}
          >
            <TextField
              label="Key referencia"
              fullWidth
              error={Boolean(errors.eviIdentifkeyRefe)}
              helperText={errors.eviIdentifkeyRefe?.message}
              {...register("eviIdentifkeyRefe", {
                required: "La key de referencia es obligatoria"
              })}
            />

            <TextField
              label="Key evidencia"
              fullWidth
              error={Boolean(errors.eviIdentifkeyEvid)}
              helperText={errors.eviIdentifkeyEvid?.message}
              {...register("eviIdentifkeyEvid", {
                required: "La evidencia es obligatoria"
              })}
            />

            <TextField
              label="Tipo registro"
              select
              fullWidth
              defaultValue="REPORTE_OPERACION"
              error={Boolean(errors.eviTiporegistroRefe)}
              helperText={errors.eviTiporegistroRefe?.message}
              {...register("eviTiporegistroRefe", {
                required: "El tipo de registro es obligatorio"
              })}
            >
              {tipoRegistroOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Key registro destino"
              fullWidth
              error={Boolean(errors.eviIdentifregistroRefe)}
              helperText={errors.eviIdentifregistroRefe?.message}
              {...register("eviIdentifregistroRefe", {
                required: "El registro destino es obligatorio"
              })}
            />

            <TextField
              label="Tipo registro interno"
              fullWidth
              placeholder="1"
              {...register("eviTiporegistRefe")}
            />

            <TextField
              label="Estado registro"
              fullWidth
              placeholder="1"
              {...register("eviEstadoregRefe")}
            />

            <TextField
              label="Observación"
              fullWidth
              multiline
              minRows={3}
              sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
              {...register("eviObservacionRefe")}
            />
          </Box>
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