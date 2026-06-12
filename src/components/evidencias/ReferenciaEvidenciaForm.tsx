"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReferenciaEvidenciaDto } from "../../types/evidencias.types";

const schema = z.object({
  eviIdentifkeyRefe: z.string().min(1, "La key de referencia es obligatoria"),
  eviIdentifkeyEvid: z.string().min(1, "La evidencia es obligatoria"),
  eviTiporegistroRefe: z.string().min(1, "El tipo de registro es obligatorio"),
  eviIdentifregistroRefe: z.string().min(1, "El registro destino es obligatorio"),
  eviObservacionRefe: z.string().optional(),
  eviTiporegistRefe: z.string().optional(),
  eviEstadoregRefe: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface ReferenciaEvidenciaFormProps {
  loading?: boolean;
  evidenciaKeyDefault?: string;
  registroKeyDefault?: string;
  tipoRegistroDefault?: string;
  onCancel: () => void;
  onSubmit: (data: ReferenciaEvidenciaDto) => void;
}

const tipoRegistroOptions = [
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

export function ReferenciaEvidenciaForm({
  loading = false,
  evidenciaKeyDefault = "",
  registroKeyDefault = "",
  tipoRegistroDefault = "REPORTE_OPERACION",
  onCancel,
  onSubmit
}: ReferenciaEvidenciaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eviIdentifkeyRefe: `REFE-${Date.now().toString().slice(-6)}`,
      eviIdentifkeyEvid: evidenciaKeyDefault,
      eviTiporegistroRefe: tipoRegistroDefault || "REPORTE_OPERACION",
      eviIdentifregistroRefe: registroKeyDefault,
      eviObservacionRefe: "",
      eviTiporegistRefe: "1",
      eviEstadoregRefe: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      eviIdentifkeyRefe: values.eviIdentifkeyRefe,
      eviIdentifkeyEvid: values.eviIdentifkeyEvid,
      eviTiporegistroRefe: values.eviTiporegistroRefe,
      eviIdentifregistroRefe: values.eviIdentifregistroRefe,
      eviObservacionRefe: values.eviObservacionRefe || "",
      eviTiporegistRefe: values.eviTiporegistRefe || "1",
      eviEstadoregRefe: values.eviEstadoregRefe || "1"
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
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
            {...register("eviIdentifkeyRefe")}
          />

          <TextField
            label="Key evidencia"
            fullWidth
            error={Boolean(errors.eviIdentifkeyEvid)}
            helperText={errors.eviIdentifkeyEvid?.message}
            {...register("eviIdentifkeyEvid")}
          />

          <TextField
            label="Tipo registro"
            select
            fullWidth
            defaultValue={tipoRegistroDefault || "REPORTE_OPERACION"}
            error={Boolean(errors.eviTiporegistroRefe)}
            helperText={errors.eviTiporegistroRefe?.message}
            {...register("eviTiporegistroRefe")}
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
            {...register("eviIdentifregistroRefe")}
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
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </form>
  );
}