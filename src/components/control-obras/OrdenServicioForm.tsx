"use client";

import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from "@mui/material";
import { useForm } from "react-hook-form";
import { OrdenServicioDto } from "../../types/controlObras.types";

interface OrdenServicioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: OrdenServicioDto | null;
  onClose: () => void;
  onSubmit: (data: OrdenServicioDto) => Promise<void> | void;
}

const defaultValues: OrdenServicioDto = {
  orsIdentifkeyOrde: "",
  orsAutorifechaOrde: "",
  orsCodservicioSebs: "",
  orsServiceventOrde: "",
  orsServiclugarOrde: "",
  orsServicobjetoOrde: "",
  orsPlanfechiniOrde: "",
  orsPlanfechfinOrde: "",
  prvIdentifkeyMprv: "",
  prvIdentifkeyRelg: "",
  orsValorbaseOrde: 0,
  orsValordeivaOrde: 0,
  orsValortotalOrde: 0,
  orsTiporegistOrde: "1",
  orsEstadoregOrde: "1"
};

export function OrdenServicioForm({
  open,
  loading = false,
  initialData,
  onClose,
  onSubmit
}: OrdenServicioFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OrdenServicioDto>({
    defaultValues
  });

  useEffect(() => {
    reset(initialData ?? defaultValues);
  }, [initialData, reset, open]);

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Editar orden de servicio" : "Crear orden de servicio"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código orden"
              {...register("orsIdentifkeyOrde", {
                required: "El código de la orden es obligatorio"
              })}
              error={!!errors.orsIdentifkeyOrde}
              helperText={errors.orsIdentifkeyOrde?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha autorización"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsAutorifechaOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Código servicio"
              {...register("orsCodservicioSebs")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Evento / servicio"
              {...register("orsServiceventOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Lugar del servicio"
              {...register("orsServiclugarOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Objeto de la orden"
              {...register("orsServicobjetoOrde", {
                required: "El objeto de la orden es obligatorio"
              })}
              error={!!errors.orsServicobjetoOrde}
              helperText={errors.orsServicobjetoOrde?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha inicio planeada"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsPlanfechiniOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha fin planeada"
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              {...register("orsPlanfechfinOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Proveedor"
              {...register("prvIdentifkeyMprv", {
                required: "El proveedor es obligatorio"
              })}
              error={!!errors.prvIdentifkeyMprv}
              helperText={errors.prvIdentifkeyMprv?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Representante legal"
              {...register("prvIdentifkeyRelg")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor base"
              {...register("orsValorbaseOrde", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor IVA"
              {...register("orsValordeivaOrde", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Valor total"
              {...register("orsValortotalOrde", { valueAsNumber: true })}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tipo registro"
              {...register("orsTiporegistOrde")}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Estado"
              {...register("orsEstadoregOrde")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}