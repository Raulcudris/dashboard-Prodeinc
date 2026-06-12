"use client";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  MenuItem,
  TextField
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipoDto } from "../../types/equipos.types";

const schema = z.object({
  prvIdentifkeyInve: z.string().min(1, "La key del equipo es obligatoria"),
  prvIdentifkeyMprv: z.string().min(1, "El proveedor es obligatorio"),
  prvTipoequipoTieq: z.string().min(1, "El tipo de equipo es obligatorio"),
  prvNombrequipoInve: z.string().min(1, "El nombre del equipo es obligatorio"),
  prvRefermodeloInve: z.string().optional(),
  prvEquipoestadoInve: z.string().optional(),
  prvEquipoactivoInve: z.string().optional(),
  prvEstadoregInve: z.string().optional(),
  prvDescripcionInve: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface EquipoFormProps {
  initialData?: EquipoDto | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: EquipoDto) => void;
}

const defaultValues: FormValues = {
  prvIdentifkeyInve: "",
  prvIdentifkeyMprv: "",
  prvTipoequipoTieq: "",
  prvNombrequipoInve: "",
  prvRefermodeloInve: "",
  prvEquipoestadoInve: "A01",
  prvEquipoactivoInve: "1",
  prvEstadoregInve: "1",
  prvDescripcionInve: ""
};

export function EquipoForm({
  initialData,
  loading = false,
  onCancel,
  onSubmit
}: EquipoFormProps) {
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
        prvIdentifkeyInve: initialData.prvIdentifkeyInve ?? "",
        prvIdentifkeyMprv: initialData.prvIdentifkeyMprv ?? "",
        prvTipoequipoTieq: initialData.prvTipoequipoTieq ?? "",
        prvNombrequipoInve: initialData.prvNombrequipoInve ?? "",
        prvRefermodeloInve: initialData.prvRefermodeloInve ?? "",
        prvEquipoestadoInve: initialData.prvEquipoestadoInve ?? "A01",
        prvEquipoactivoInve: initialData.prvEquipoactivoInve ?? "1",
        prvEstadoregInve: initialData.prvEstadoregInve ?? "1",
        prvDescripcionInve: initialData.prvDescripcionInve ?? ""
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      ...values,
      prvEquipoestadoInve: values.prvEquipoestadoInve || "A01",
      prvEquipoactivoInve: values.prvEquipoactivoInve || "1",
      prvEstadoregInve: values.prvEstadoregInve || "1"
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
            label="Key equipo"
            fullWidth
            disabled={Boolean(initialData)}
            error={Boolean(errors.prvIdentifkeyInve)}
            helperText={errors.prvIdentifkeyInve?.message}
            {...register("prvIdentifkeyInve")}
          />

          <TextField
            label="Key proveedor"
            fullWidth
            error={Boolean(errors.prvIdentifkeyMprv)}
            helperText={errors.prvIdentifkeyMprv?.message}
            {...register("prvIdentifkeyMprv")}
          />

          <TextField
            label="Key tipo equipo"
            fullWidth
            error={Boolean(errors.prvTipoequipoTieq)}
            helperText={errors.prvTipoequipoTieq?.message}
            {...register("prvTipoequipoTieq")}
          />

          <TextField
            label="Nombre equipo"
            fullWidth
            error={Boolean(errors.prvNombrequipoInve)}
            helperText={errors.prvNombrequipoInve?.message}
            {...register("prvNombrequipoInve")}
          />

          <TextField
            label="Referencia / modelo"
            fullWidth
            {...register("prvRefermodeloInve")}
          />

          <TextField
            label="Disponibilidad"
            fullWidth
            select
            defaultValue="1"
            {...register("prvEquipoactivoInve")}
          >
            <MenuItem value="1">Disponible</MenuItem>
            <MenuItem value="2">Asignado</MenuItem>
          </TextField>

          <TextField
            label="Estado operativo"
            fullWidth
            select
            defaultValue="A01"
            {...register("prvEquipoestadoInve")}
          >
            <MenuItem value="A01">Activo funcional</MenuItem>
            <MenuItem value="I01">Inactivo por daño</MenuItem>
          </TextField>

          <TextField
            label="Estado registro"
            fullWidth
            select
            defaultValue="1"
            {...register("prvEstadoregInve")}
          >
            <MenuItem value="1">Activo</MenuItem>
            <MenuItem value="2">Inactivo</MenuItem>
          </TextField>

          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            {...register("prvDescripcionInve")}
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