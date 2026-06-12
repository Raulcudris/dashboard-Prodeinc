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
import { PlanSemanalDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyPlse: z.string().min(1, "La key del plan semanal es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  orsIdentifkeyPltr: z.string().min(1, "El plan de trabajo es obligatorio"),
  orsIdentifkeyPsem: z.string().min(1, "La proyección semanal es obligatoria"),
  orsCantidunidadPlse: z.coerce.number().min(0, "La cantidad no puede ser negativa"),
  orsValorunidadPlse: z.coerce.number().min(0, "El valor unidad no puede ser negativo"),
  orsValortotalPlse: z.coerce.number().min(0, "El valor total no puede ser negativo"),
  orsEjecutunidadPlse: z.coerce.number().min(0, "La cantidad ejecutada no puede ser negativa"),
  orsValorejecutPlse: z.coerce.number().min(0, "El valor ejecutado no puede ser negativo"),
  orsTiporegistPlse: z.string().optional(),
  orsEstadoregPlse: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface PlanSemanalFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  planKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: PlanSemanalDto) => void;
}

export function PlanSemanalForm({
  loading = false,
  ordenKeyDefault = "",
  planKeyDefault = "",
  onCancel,
  onSubmit
}: PlanSemanalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyPlse: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsIdentifkeyPltr: planKeyDefault,
      orsIdentifkeyPsem: "",
      orsCantidunidadPlse: 0,
      orsValorunidadPlse: 0,
      orsValortotalPlse: 0,
      orsEjecutunidadPlse: 0,
      orsValorejecutPlse: 0,
      orsTiporegistPlse: "1",
      orsEstadoregPlse: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsIdentifkeyPlse: values.orsIdentifkeyPlse,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsIdentifkeyPltr: values.orsIdentifkeyPltr,
      orsIdentifkeyPsem: values.orsIdentifkeyPsem,
      orsCantidunidadPlse: Number(values.orsCantidunidadPlse || 0),
      orsValorunidadPlse: Number(values.orsValorunidadPlse || 0),
      orsValortotalPlse: Number(values.orsValortotalPlse || 0),
      orsEjecutunidadPlse: Number(values.orsEjecutunidadPlse || 0),
      orsValorejecutPlse: Number(values.orsValorejecutPlse || 0),
      orsTiporegistPlse: values.orsTiporegistPlse || "1",
      orsEstadoregPlse: values.orsEstadoregPlse || "1"
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
            label="Key plan semanal"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPlse)}
            helperText={errors.orsIdentifkeyPlse?.message}
            {...register("orsIdentifkeyPlse")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Key plan trabajo"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPltr)}
            helperText={errors.orsIdentifkeyPltr?.message}
            {...register("orsIdentifkeyPltr")}
          />

          <TextField
            label="Key proyección semanal"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPsem)}
            helperText={errors.orsIdentifkeyPsem?.message}
            {...register("orsIdentifkeyPsem")}
          />

          <TextField
            label="Cantidad planeada"
            type="number"
            fullWidth
            error={Boolean(errors.orsCantidunidadPlse)}
            helperText={errors.orsCantidunidadPlse?.message}
            {...register("orsCantidunidadPlse")}
          />

          <TextField
            label="Valor unidad"
            type="number"
            fullWidth
            error={Boolean(errors.orsValorunidadPlse)}
            helperText={errors.orsValorunidadPlse?.message}
            {...register("orsValorunidadPlse")}
          />

          <TextField
            label="Valor total"
            type="number"
            fullWidth
            error={Boolean(errors.orsValortotalPlse)}
            helperText={errors.orsValortotalPlse?.message}
            {...register("orsValortotalPlse")}
          />

          <TextField
            label="Cantidad ejecutada"
            type="number"
            fullWidth
            error={Boolean(errors.orsEjecutunidadPlse)}
            helperText={errors.orsEjecutunidadPlse?.message}
            {...register("orsEjecutunidadPlse")}
          />

          <TextField
            label="Valor ejecutado"
            type="number"
            fullWidth
            error={Boolean(errors.orsValorejecutPlse)}
            helperText={errors.orsValorejecutPlse?.message}
            {...register("orsValorejecutPlse")}
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