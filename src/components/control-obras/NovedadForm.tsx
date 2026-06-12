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
import { NovedadDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyNove: z.string().min(1, "La key de la novedad es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  orsFechreportNove: z.string().min(1, "La fecha de reporte es obligatoria"),
  orsTiponovedadNovt: z.string().min(1, "El tipo de novedad es obligatorio"),
  orsRegistrbaseNove: z.string().min(1, "El registro base es obligatorio"),
  orsRegistrnoveNove: z.string().min(1, "El registro de novedad es obligatorio"),
  orsEstadoregNove: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface NovedadFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  registroBaseDefault?: string;
  onCancel: () => void;
  onSubmit: (data: NovedadDto) => void;
}

export function NovedadForm({
  loading = false,
  ordenKeyDefault = "",
  registroBaseDefault = "",
  onCancel,
  onSubmit
}: NovedadFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyNove: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      orsFechreportNove: today,
      orsTiponovedadNovt: "CLIMA",
      orsRegistrbaseNove: registroBaseDefault,
      orsRegistrnoveNove: "",
      orsEstadoregNove: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsIdentifkeyNove: values.orsIdentifkeyNove,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsFechreportNove: values.orsFechreportNove,
      orsTiponovedadNovt: values.orsTiponovedadNovt,
      orsRegistrbaseNove: values.orsRegistrbaseNove,
      orsRegistrnoveNove: values.orsRegistrnoveNove,
      orsEstadoregNove: values.orsEstadoregNove || "1"
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
            label="Key novedad"
            fullWidth
            error={Boolean(errors.orsIdentifkeyNove)}
            helperText={errors.orsIdentifkeyNove?.message}
            {...register("orsIdentifkeyNove")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Fecha reporte"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsFechreportNove)}
            helperText={errors.orsFechreportNove?.message}
            {...register("orsFechreportNove")}
          />

          <TextField
            label="Tipo novedad"
            select
            fullWidth
            defaultValue="CLIMA"
            error={Boolean(errors.orsTiponovedadNovt)}
            helperText={errors.orsTiponovedadNovt?.message}
            {...register("orsTiponovedadNovt")}
          >
            <MenuItem value="CLIMA">Clima</MenuItem>
            <MenuItem value="EQUIPO">Equipo / maquinaria</MenuItem>
            <MenuItem value="PERSONAL">Personal</MenuItem>
            <MenuItem value="MATERIAL">Materiales</MenuItem>
            <MenuItem value="ACCESO">Acceso / vía</MenuItem>
            <MenuItem value="SEGURIDAD">Seguridad</MenuItem>
            <MenuItem value="OTRA">Otra</MenuItem>
          </TextField>

          <TextField
            label="Registro base"
            fullWidth
            error={Boolean(errors.orsRegistrbaseNove)}
            helperText={errors.orsRegistrbaseNove?.message}
            {...register("orsRegistrbaseNove")}
          />

          <TextField
            label="Registro novedad"
            fullWidth
            error={Boolean(errors.orsRegistrnoveNove)}
            helperText={errors.orsRegistrnoveNove?.message}
            {...register("orsRegistrnoveNove")}
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