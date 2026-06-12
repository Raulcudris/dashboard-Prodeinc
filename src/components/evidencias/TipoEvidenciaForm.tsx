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
import { TipoEvidenciaDto } from "../../types/evidencias.types";

const schema = z.object({
  eviIdentifkeyTiev: z.string().min(1, "La key del tipo es obligatoria"),
  eviDescripcionTiev: z.string().min(1, "La descripción es obligatoria"),
  eviTiporegistTiev: z.string().optional(),
  eviEstadoregTiev: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface TipoEvidenciaFormProps {
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: TipoEvidenciaDto) => void;
}

export function TipoEvidenciaForm({
  loading = false,
  onCancel,
  onSubmit
}: TipoEvidenciaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eviIdentifkeyTiev: "",
      eviDescripcionTiev: "",
      eviTiporegistTiev: "1",
      eviEstadoregTiev: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      eviIdentifkeyTiev: values.eviIdentifkeyTiev.trim().toUpperCase(),
      eviDescripcionTiev: values.eviDescripcionTiev,
      eviTiporegistTiev: values.eviTiporegistTiev || "1",
      eviEstadoregTiev: values.eviEstadoregTiev || "1"
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Key tipo evidencia"
            fullWidth
            error={Boolean(errors.eviIdentifkeyTiev)}
            helperText={errors.eviIdentifkeyTiev?.message}
            {...register("eviIdentifkeyTiev")}
          />

          <TextField
            label="Descripción"
            fullWidth
            error={Boolean(errors.eviDescripcionTiev)}
            helperText={errors.eviDescripcionTiev?.message}
            {...register("eviDescripcionTiev")}
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