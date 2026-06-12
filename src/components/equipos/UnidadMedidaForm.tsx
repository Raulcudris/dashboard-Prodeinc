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
import { UnidadMedidaDto } from "../../types/equipos.types";

const schema = z.object({
  prvTipunidamedUnme: z.string().min(1, "La key de unidad es obligatoria"),
  prvDescmedidaUnme: z.string().min(1, "La descripción es obligatoria"),
  prvEstadoregUnme: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface UnidadMedidaFormProps {
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: UnidadMedidaDto) => void;
}

export function UnidadMedidaForm({
  loading = false,
  onCancel,
  onSubmit
}: UnidadMedidaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      prvTipunidamedUnme: "",
      prvDescmedidaUnme: "",
      prvEstadoregUnme: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      ...values,
      prvEstadoregUnme: values.prvEstadoregUnme || "1"
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Key unidad"
            fullWidth
            error={Boolean(errors.prvTipunidamedUnme)}
            helperText={errors.prvTipunidamedUnme?.message}
            {...register("prvTipunidamedUnme")}
          />

          <TextField
            label="Descripción"
            fullWidth
            error={Boolean(errors.prvDescmedidaUnme)}
            helperText={errors.prvDescmedidaUnme?.message}
            {...register("prvDescmedidaUnme")}
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