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
import { OrdenServicioDto } from "../../types/controlObras.types";

const schema = z
  .object({
    orsIdentifkeyOrde: z.string().min(1, "La key de la orden es obligatoria"),
    orsAutorifechaOrde: z.string().min(1, "La fecha de autorización es obligatoria"),
    orsCodservicioSebs: z.string().min(1, "El código de servicio es obligatorio"),
    orsServiceventOrde: z.string().min(1, "El evento o servicio es obligatorio"),
    orsServiclugarOrde: z.string().min(1, "El lugar del servicio es obligatorio"),
    orsServicobjetoOrde: z.string().min(1, "El objeto del servicio es obligatorio"),
    orsPlanfechiniOrde: z.string().min(1, "La fecha inicial es obligatoria"),
    orsPlanfechfinOrde: z.string().min(1, "La fecha final es obligatoria"),
    prvIdentifkeyMprv: z.string().min(1, "El proveedor es obligatorio"),
    prvIdentifkeyRelg: z.string().nullable().optional(),
    orsValorbaseOrde: z.coerce.number().min(0, "El valor base no puede ser negativo"),
    orsValordeivaOrde: z.coerce.number().min(0, "El IVA no puede ser negativo"),
    orsValortotalOrde: z.coerce.number().min(0, "El total no puede ser negativo"),
    orsTiporegistOrde: z.string().optional(),
    orsEstadoregOrde: z.string().optional()
  })
  .refine(
    data => {
      if (!data.orsPlanfechiniOrde || !data.orsPlanfechfinOrde) {
        return true;
      }

      return new Date(data.orsPlanfechfinOrde) >= new Date(data.orsPlanfechiniOrde);
    },
    {
      message: "La fecha final no puede ser menor que la fecha inicial",
      path: ["orsPlanfechfinOrde"]
    }
  );

type FormValues = z.infer<typeof schema>;

interface OrdenServicioFormProps {
  initialData?: OrdenServicioDto | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (data: OrdenServicioDto) => void;
}

const defaultValues: FormValues = {
  orsIdentifkeyOrde: "",
  orsAutorifechaOrde: "",
  orsCodservicioSebs: "MAQ",
  orsServiceventOrde: "",
  orsServiclugarOrde: "",
  orsServicobjetoOrde: "",
  orsPlanfechiniOrde: "",
  orsPlanfechfinOrde: "",
  prvIdentifkeyMprv: "",
  prvIdentifkeyRelg: null,
  orsValorbaseOrde: 0,
  orsValordeivaOrde: 0,
  orsValortotalOrde: 0,
  orsTiporegistOrde: "1",
  orsEstadoregOrde: "1"
};

export function OrdenServicioForm({
  initialData,
  loading = false,
  onCancel,
  onSubmit
}: OrdenServicioFormProps) {
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
        orsIdentifkeyOrde: initialData.orsIdentifkeyOrde ?? "",
        orsAutorifechaOrde: initialData.orsAutorifechaOrde ?? "",
        orsCodservicioSebs: initialData.orsCodservicioSebs ?? "MAQ",
        orsServiceventOrde: initialData.orsServiceventOrde ?? "",
        orsServiclugarOrde: initialData.orsServiclugarOrde ?? "",
        orsServicobjetoOrde: initialData.orsServicobjetoOrde ?? "",
        orsPlanfechiniOrde: initialData.orsPlanfechiniOrde ?? "",
        orsPlanfechfinOrde: initialData.orsPlanfechfinOrde ?? "",
        prvIdentifkeyMprv: initialData.prvIdentifkeyMprv ?? "",
        prvIdentifkeyRelg: initialData.prvIdentifkeyRelg ?? null,
        orsValorbaseOrde: initialData.orsValorbaseOrde ?? 0,
        orsValordeivaOrde: initialData.orsValordeivaOrde ?? 0,
        orsValortotalOrde: initialData.orsValortotalOrde ?? 0,
        orsTiporegistOrde: initialData.orsTiporegistOrde ?? "1",
        orsEstadoregOrde: initialData.orsEstadoregOrde ?? "1"
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const submitForm = (values: FormValues) => {
    const data: OrdenServicioDto = {
      orsIdentifkeyOrde: values.orsIdentifkeyOrde,
      orsAutorifechaOrde: values.orsAutorifechaOrde,
      orsCodservicioSebs: values.orsCodservicioSebs,
      orsServiceventOrde: values.orsServiceventOrde,
      orsServiclugarOrde: values.orsServiclugarOrde,
      orsServicobjetoOrde: values.orsServicobjetoOrde,
      orsPlanfechiniOrde: values.orsPlanfechiniOrde,
      orsPlanfechfinOrde: values.orsPlanfechfinOrde,
      prvIdentifkeyMprv: values.prvIdentifkeyMprv,
      prvIdentifkeyRelg: values.prvIdentifkeyRelg || null,
      orsValorbaseOrde: Number(values.orsValorbaseOrde || 0),
      orsValordeivaOrde: Number(values.orsValordeivaOrde || 0),
      orsValortotalOrde: Number(values.orsValortotalOrde || 0),
      orsTiporegistOrde: values.orsTiporegistOrde || "1",
      orsEstadoregOrde: values.orsEstadoregOrde || "1"
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
            label="Key orden"
            fullWidth
            disabled={Boolean(initialData)}
            error={Boolean(errors.orsIdentifkeyOrde)}
            helperText={errors.orsIdentifkeyOrde?.message}
            {...register("orsIdentifkeyOrde")}
          />

          <TextField
            label="Fecha autorización"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsAutorifechaOrde)}
            helperText={errors.orsAutorifechaOrde?.message}
            {...register("orsAutorifechaOrde")}
          />

          <TextField
            label="Código servicio"
            fullWidth
            error={Boolean(errors.orsCodservicioSebs)}
            helperText={errors.orsCodservicioSebs?.message}
            {...register("orsCodservicioSebs")}
          />

          <TextField
            label="Key proveedor"
            fullWidth
            error={Boolean(errors.prvIdentifkeyMprv)}
            helperText={errors.prvIdentifkeyMprv?.message}
            {...register("prvIdentifkeyMprv")}
          />

          <TextField
            label="Fecha inicial plan"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsPlanfechiniOrde)}
            helperText={errors.orsPlanfechiniOrde?.message}
            {...register("orsPlanfechiniOrde")}
          />

          <TextField
            label="Fecha final plan"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.orsPlanfechfinOrde)}
            helperText={errors.orsPlanfechfinOrde?.message}
            {...register("orsPlanfechfinOrde")}
          />

          <TextField
            label="Valor base"
            type="number"
            fullWidth
            error={Boolean(errors.orsValorbaseOrde)}
            helperText={errors.orsValorbaseOrde?.message}
            {...register("orsValorbaseOrde")}
          />

          <TextField
            label="Valor IVA"
            type="number"
            fullWidth
            error={Boolean(errors.orsValordeivaOrde)}
            helperText={errors.orsValordeivaOrde?.message}
            {...register("orsValordeivaOrde")}
          />

          <TextField
            label="Valor total"
            type="number"
            fullWidth
            error={Boolean(errors.orsValortotalOrde)}
            helperText={errors.orsValortotalOrde?.message}
            {...register("orsValortotalOrde")}
          />

          <TextField
            label="Lugar del servicio"
            fullWidth
            error={Boolean(errors.orsServiclugarOrde)}
            helperText={errors.orsServiclugarOrde?.message}
            {...register("orsServiclugarOrde")}
          />

          <TextField
            label="Evento / Servicio"
            fullWidth
            multiline
            minRows={2}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            error={Boolean(errors.orsServiceventOrde)}
            helperText={errors.orsServiceventOrde?.message}
            {...register("orsServiceventOrde")}
          />

          <TextField
            label="Objeto del servicio"
            fullWidth
            multiline
            minRows={3}
            sx={{ gridColumn: { xs: "auto", md: "1 / 3" } }}
            error={Boolean(errors.orsServicobjetoOrde)}
            helperText={errors.orsServicobjetoOrde?.message}
            {...register("orsServicobjetoOrde")}
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