"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  TextField
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TipoEquipoDto } from "../../types/equipos.types";

const schema = z.object({
  prvTipoequipoTieq: z.string().min(1, "La key del tipo de equipo es obligatoria"),
  prvDescripcionTieq: z.string().min(1, "La descripción es obligatoria"),
  prvIdentifkeyUnme: z.string().min(1, "La unidad de medida es obligatoria"),
  prvTiporegistTieq: z.string().optional(),
  prvEstadoregTieq: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface TipoEquipoFormProps {
  initialData?: TipoEquipoDto | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: TipoEquipoDto) => void;
}

const defaultValues: FormValues = {
  prvTipoequipoTieq: "",
  prvDescripcionTieq: "",
  prvIdentifkeyUnme: "",
  prvTiporegistTieq: "1",
  prvEstadoregTieq: "1"
};

export function TipoEquipoForm({
  initialData,
  loading = false,
  onCancel,
  onSubmit
}: TipoEquipoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      reset({
        prvTipoequipoTieq: initialData.prvTipoequipoTieq ?? "",
        prvDescripcionTieq: initialData.prvDescripcionTieq ?? "",
        prvIdentifkeyUnme: initialData.prvIdentifkeyUnme ?? "",
        prvTiporegistTieq: initialData.prvTiporegistTieq ?? "1",
        prvEstadoregTieq: initialData.prvEstadoregTieq ?? "1"
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      ...values,
      prvTiporegistTieq: values.prvTiporegistTieq || "1",
      prvEstadoregTieq: values.prvEstadoregTieq || "1"
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            label="Key tipo equipo"
            fullWidth
            disabled={Boolean(initialData)}
            error={Boolean(errors.prvTipoequipoTieq)}
            helperText={errors.prvTipoequipoTieq?.message}
            {...register("prvTipoequipoTieq")}
          />

          <TextField
            label="Descripción"
            fullWidth
            error={Boolean(errors.prvDescripcionTieq)}
            helperText={errors.prvDescripcionTieq?.message}
            {...register("prvDescripcionTieq")}
          />

          <TextField
            label="Key unidad de medida"
            fullWidth
            error={Boolean(errors.prvIdentifkeyUnme)}
            helperText={errors.prvIdentifkeyUnme?.message}
            {...register("prvIdentifkeyUnme")}
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