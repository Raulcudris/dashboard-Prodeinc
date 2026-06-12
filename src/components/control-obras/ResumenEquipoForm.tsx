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
import { ResumenEquipoDto } from "../../types/controlObras.types";

const schema = z.object({
  orsIdentifkeyRseq: z.string().min(1, "La key del resumen es obligatoria"),
  orsIdentifkeyOrde: z.string().min(1, "La orden es obligatoria"),
  prvTipoequipoTieq: z.string().min(1, "El tipo de equipo es obligatorio"),
  orsCantidunidadRseq: z.coerce.number().min(0, "La cantidad no puede ser negativa"),
  orsValorunidadRseq: z.coerce.number().min(0, "El valor unitario no puede ser negativo"),
  orsValortotalRseq: z.coerce.number().min(0, "El valor total no puede ser negativo"),
  orsTiporegistRseq: z.string().optional(),
  orsEstadoregRseq: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface ResumenEquipoFormProps {
  loading?: boolean;
  ordenKeyDefault?: string;
  onCancel: () => void;
  onSubmit: (data: ResumenEquipoDto) => void;
}

export function ResumenEquipoForm({
  loading = false,
  ordenKeyDefault = "",
  onCancel,
  onSubmit
}: ResumenEquipoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orsIdentifkeyRseq: "",
      orsIdentifkeyOrde: ordenKeyDefault,
      prvTipoequipoTieq: "",
      orsCantidunidadRseq: 0,
      orsValorunidadRseq: 0,
      orsValortotalRseq: 0,
      orsTiporegistRseq: "1",
      orsEstadoregRseq: "1"
    }
  });

  const submitForm = (values: FormValues) => {
    const data: ResumenEquipoDto = {
      orsIdentifkeyRseq: values.orsIdentifkeyRseq,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      prvTipoequipoTieq: values.prvTipoequipoTieq,
      orsCantidunidadRseq: Number(values.orsCantidunidadRseq || 0),
      orsValorunidadRseq: Number(values.orsValorunidadRseq || 0),
      orsValortotalRseq: Number(values.orsValortotalRseq || 0),
      orsTiporegistRseq: values.orsTiporegistRseq || "1",
      orsEstadoregRseq: values.orsEstadoregRseq || "1"
    };

    onSubmit(data);
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
            label="Key resumen"
            fullWidth
            error={Boolean(errors.orsIdentifkeyRseq)}
            helperText={errors.orsIdentifkeyRseq?.message}
            {...register("orsIdentifkeyRseq")}
          />

          <TextField
            label="Key orden"
            fullWidth
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Tipo equipo"
            fullWidth
            error={Boolean(errors.prvTipoequipoTieq)}
            helperText={errors.prvTipoequipoTieq?.message}
            {...register("prvTipoequipoTieq")}
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