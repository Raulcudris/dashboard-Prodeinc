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
import { ProyeccionSemanalDto } from "../../types/controlObras.types";

const schema = z
  .object({
    orsIdentifkeyPsem: z.string().min(1, "La key de proyección es obligatoria"),
    orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
    orsNumerosemPsem: z.coerce.number().min(1, "El número de semana debe ser mayor a 0"),
    orsTitulosemPsem: z.string().min(1, "El título de semana es obligatorio"),
    orsSemfechiniPsem: z.string().min(1, "La fecha inicial es obligatoria"),
    orsSemfechfinPsem: z.string().min(1, "La fecha final es obligatoria"),
    orsDiashabilesPsem: z.string().optional(),
    orsDiasnhabilesPsem: z.string().optional(),
    orsTiporegistPsem: z.string().optional(),
    orsEstadoregPsem: z.string().optional()
  })
  .refine(
    data => new Date(data.orsSemfechfinPsem) >= new Date(data.orsSemfechiniPsem),
    {
      message: "La fecha final no puede ser menor que la fecha inicial",
      path: ["orsSemfechfinPsem"]
    }
  );

type FormValues = z.infer<typeof schema>;

interface ProyeccionSemanalFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: ProyeccionSemanalDto) => void;
}

export function ProyeccionSemanalForm({
  loading = false,
  ordenKeyDefault = "",
  onCancel,
  onSubmit
}: ProyeccionSemanalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyPsem: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsNumerosemPsem: 1,
      orsTitulosemPsem: "",
      orsSemfechiniPsem: "",
      orsSemfechfinPsem: "",
      orsDiashabilesPsem: "LUN,MAR,MIE,JUE,VIE,SAB",
      orsDiasnhabilesPsem: "DOM",
      orsTiporegistPsem: "1",
      orsEstadoregPsem: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsIdentifkeyPsem: values.orsIdentifkeyPsem,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsNumerosemPsem: Number(values.orsNumerosemPsem || 1),
      orsTitulosemPsem: values.orsTitulosemPsem,
      orsSemfechiniPsem: values.orsSemfechiniPsem,
      orsSemfechfinPsem: values.orsSemfechfinPsem,
      orsDiashabilesPsem: values.orsDiashabilesPsem || "",
      orsDiasnhabilesPsem: values.orsDiasnhabilesPsem || "",
      orsTiporegistPsem: values.orsTiporegistPsem || "1",
      orsEstadoregPsem: values.orsEstadoregPsem || "1"
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
            label="Key proyección"
            fullWidth
            error={Boolean(errors.orsIdentifkeyPsem)}
            helperText={errors.orsIdentifkeyPsem?.message}
            {...register("orsIdentifkeyPsem")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Número semana"
            type="number"
            fullWidth
            error={Boolean(errors.orsNumerosemPsem)}
            helperText={errors.orsNumerosemPsem?.message}
            {...register("orsNumerosemPsem")}
          />

          <TextField
            label="Título semana"
            fullWidth
            error={Boolean(errors.orsTitulosemPsem)}
            helperText={errors.orsTitulosemPsem?.message}
            {...register("orsTitulosemPsem")}
          />

          <TextField
            label="Fecha inicial"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsSemfechiniPsem)}
            helperText={errors.orsSemfechiniPsem?.message}
            {...register("orsSemfechiniPsem")}
          />

          <TextField
            label="Fecha final"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsSemfechfinPsem)}
            helperText={errors.orsSemfechfinPsem?.message}
            {...register("orsSemfechfinPsem")}
          />

          <TextField
            label="Días hábiles"
            fullWidth
            {...register("orsDiashabilesPsem")}
          />

          <TextField
            label="Días no hábiles"
            fullWidth
            {...register("orsDiasnhabilesPsem")}
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