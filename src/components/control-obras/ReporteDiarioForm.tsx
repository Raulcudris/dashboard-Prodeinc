"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReporteDiarioDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyPdia: z.string().min(1, "La key del reporte es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  orsIdentifkeyPlse: z.string().min(1, "El plan semanal es obligatorio"),
  orsIdentifkeyPsem: z.string().min(1, "La proyección semanal es obligatoria"),
  orsObservacionPdia: z.string().optional(),
  orsFechareportPdia: z.string().min(1, "La fecha del reporte es obligatoria"),
  orsEjecutunidadPdia: z.coerce
    .number()
    .min(0, "La cantidad ejecutada no puede ser negativa"),
  orsFechasistemaPdia: z.string().optional(),
  orsTiporegistPdia: z.string().optional(),
  orsEstadoregPdia: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface ReporteDiarioFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  planSemanalKeyDefault?: string;
  proyeccionKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: ReporteDiarioDto) => void;
}

export function ReporteDiarioForm({
  loading = false,
  ordenKeyDefault = "",
  planSemanalKeyDefault = "",
  proyeccionKeyDefault = "",
  onCancel,
  onSubmit
}: ReporteDiarioFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyPdia: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsIdentifkeyPlse: planSemanalKeyDefault,
      orsIdentifkeyPsem: proyeccionKeyDefault,
      orsObservacionPdia: "",
      orsFechareportPdia: today,
      orsEjecutunidadPdia: 0,
      orsFechasistemaPdia: today,
      orsTiporegistPdia: "1",
      orsEstadoregPdia: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsIdentifkeyPdia: values.orsIdentifkeyPdia,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsIdentifkeyPlse: values.orsIdentifkeyPlse,
      orsIdentifkeyPsem: values.orsIdentifkeyPsem,
      orsObservacionPdia: values.orsObservacionPdia || "",
      orsFechareportPdia: values.orsFechareportPdia,
      orsEjecutunidadPdia: Number(values.orsEjecutunidadPdia || 0),
      orsFechasistemaPdia: values.orsFechasistemaPdia || today,
      orsTiporegistPdia: values.orsTiporegistPdia || "1",
      orsEstadoregPdia: values.orsEstadoregPdia || "1"
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
            label="Key reporte diario"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPdia)}
            helperText={errors.orsIdentifkeyPdia?.message}
            {...register("orsIdentifkeyPdia")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Key plan semanal"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPlse)}
            helperText={errors.orsIdentifkeyPlse?.message}
            {...register("orsIdentifkeyPlse")}
          />

          <TextField
            label="Key proyección semanal"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPsem)}
            helperText={errors.orsIdentifkeyPsem?.message}
            {...register("orsIdentifkeyPsem")}
          />

          <TextField
            label="Fecha reporte"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsFechareportPdia)}
            helperText={errors.orsFechareportPdia?.message}
            {...register("orsFechareportPdia")}
          />

          <TextField
            label="Cantidad ejecutada"
            type="number"
            fullWidth
            error={Boolean(errors.orsEjecutunidadPdia)}
            helperText={errors.orsEjecutunidadPdia?.message}
            {...register("orsEjecutunidadPdia")}
          />

          <TextField
            label="Fecha sistema"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("orsFechasistemaPdia")}
          />

          <TextField
            label="Observación"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            {...register("orsObservacionPdia")}
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