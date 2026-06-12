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
import { PlanTrabajoDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyPltr: z.string().min(1, "La key del plan es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  orsIdentifkeyPunt: z.string().min(1, "El sitio / punto es obligatorio"),
  orsDesactividadPltr: z.string().min(1, "La actividad es obligatoria"),
  orsIdentifkeyRseq: z.string().min(1, "El resumen de equipo es obligatorio"),
  prvIdentifkeyInve: z.string().min(1, "El equipo es obligatorio"),
  orsCantidunidadRseq: z.coerce.number().min(0, "La cantidad no puede ser negativa"),
  orsValorunidadRseq: z.coerce.number().min(0, "El valor unidad no puede ser negativo"),
  orsValortotalRseq: z.coerce.number().min(0, "El valor total no puede ser negativo"),
  orsTiporegistPltr: z.string().optional(),
  orsEstadoregPltr: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface PlanTrabajoFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: PlanTrabajoDto) => void;
}

export function PlanTrabajoForm({
  loading = false,
  ordenKeyDefault = "",
  onCancel,
  onSubmit
}: PlanTrabajoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyPltr: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsIdentifkeyPunt: "",
      orsDesactividadPltr: "",
      orsIdentifkeyRseq: "",
      prvIdentifkeyInve: "",
      orsCantidunidadRseq: 0,
      orsValorunidadRseq: 0,
      orsValortotalRseq: 0,
      orsTiporegistPltr: "1",
      orsEstadoregPltr: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsIdentifkeyPltr: values.orsIdentifkeyPltr,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsIdentifkeyPunt: values.orsIdentifkeyPunt,
      orsDesactividadPltr: values.orsDesactividadPltr,
      orsIdentifkeyRseq: values.orsIdentifkeyRseq,
      prvIdentifkeyInve: values.prvIdentifkeyInve,
      orsCantidunidadRseq: Number(values.orsCantidunidadRseq || 0),
      orsValorunidadRseq: Number(values.orsValorunidadRseq || 0),
      orsValortotalRseq: Number(values.orsValortotalRseq || 0),
      orsTiporegistPltr: values.orsTiporegistPltr || "1",
      orsEstadoregPltr: values.orsEstadoregPltr || "1"
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
            label="Key plan"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPltr)}
            helperText={errors.orsIdentifkeyPltr?.message}
            {...register("orsIdentifkeyPltr")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Key punto"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPunt)}
            helperText={errors.orsIdentifkeyPunt?.message}
            {...register("orsIdentifkeyPunt")}
          />

          <TextField
            label="Key resumen equipo"
            fullWidth
            error={Boolean(errors.orsIdentifkeyRseq)}
            helperText={errors.orsIdentifkeyRseq?.message}
            {...register("orsIdentifkeyRseq")}
          />

          <TextField
            label="Key equipo"
            fullWidth
            error={Boolean(errors.prvIdentifkeyInve)}
            helperText={errors.prvIdentifkeyInve?.message}
            {...register("prvIdentifkeyInve")}
          />

          <TextField
            label="Cantidad unidad"
            type="number"
            fullWidth
            error={Boolean(errors.orsCantidunidadRseq)}
            helperText={errors.orsCantidunidadRseq?.message}
            {...register("orsCantidunidadRseq")}
          />

          <TextField
            label="Valor unidad"
            type="number"
            fullWidth
            error={Boolean(errors.orsValorunidadRseq)}
            helperText={errors.orsValorunidadRseq?.message}
            {...register("orsValorunidadRseq")}
          />

          <TextField
            label="Valor total"
            type="number"
            fullWidth
            error={Boolean(errors.orsValortotalRseq)}
            helperText={errors.orsValortotalRseq?.message}
            {...register("orsValortotalRseq")}
          />

          <TextField
            label="Actividad"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            error={Boolean(errors.orsDesactividadPltr)}
            helperText={errors.orsDesactividadPltr?.message}
            {...register("orsDesactividadPltr")}
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