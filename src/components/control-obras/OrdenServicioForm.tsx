"use client";

import { useEffect } from "react";
import {
  Box,
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
import { EstadoRegistro } from "../../types/common.types";

interface FormValues {
  orsIdentifkeyOrde: string;
  orsAutorifechaOrde: string;
  orsCodservicioSebs: string;
  orsServiceventOrde: string;
  orsServiclugarOrde: string;
  orsServicobjetoOrde: string;
  orsPlanfechiniOrde: string;
  orsPlanfechfinOrde: string;
  prvIdentifkeyMprv: string;
  prvIdentifkeyRelg: string;
  orsValorbaseOrde: number | "";
  orsValordeivaOrde: number | "";
  orsValortotalOrde: number | "";
  orsTiporegistOrde: string;
  orsEstadoregOrde: string;
}

interface OrdenServicioFormProps {
  open: boolean;
  loading?: boolean;
  initialData?: OrdenServicioDto | null;
  onClose: () => void;
  onSubmit: (data: OrdenServicioDto) => Promise<void> | void;
}

const emptyValues: FormValues = {
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
  orsValorbaseOrde: "",
  orsValordeivaOrde: "",
  orsValortotalOrde: "",
  orsTiporegistOrde: "1",
  orsEstadoregOrde: "1"
};

function mapInitialData(data: OrdenServicioDto): FormValues {
  return {
    orsIdentifkeyOrde: data.orsIdentifkeyOrde ?? "",
    orsAutorifechaOrde: data.orsAutorifechaOrde ?? "",
    orsCodservicioSebs: data.orsCodservicioSebs ?? "",
    orsServiceventOrde: data.orsServiceventOrde ?? "",
    orsServiclugarOrde: data.orsServiclugarOrde ?? "",
    orsServicobjetoOrde: data.orsServicobjetoOrde ?? "",
    orsPlanfechiniOrde: data.orsPlanfechiniOrde ?? "",
    orsPlanfechfinOrde: data.orsPlanfechfinOrde ?? "",
    prvIdentifkeyMprv: data.prvIdentifkeyMprv ?? "",
    prvIdentifkeyRelg: data.prvIdentifkeyRelg ?? "",
    orsValorbaseOrde:
      typeof data.orsValorbaseOrde === "number" ? data.orsValorbaseOrde : "",
    orsValordeivaOrde:
      typeof data.orsValordeivaOrde === "number" ? data.orsValordeivaOrde : "",
    orsValortotalOrde:
      typeof data.orsValortotalOrde === "number" ? data.orsValortotalOrde : "",
    orsTiporegistOrde: data.orsTiporegistOrde ?? "1",
    orsEstadoregOrde: data.orsEstadoregOrde ?? "1"
  };
}

function toOptionalNumber(value: number | "" | undefined) {
  if (value === "" || value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return Number(value);
}

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
  } = useForm<FormValues>({
    defaultValues: emptyValues
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(mapInitialData(initialData));
      return;
    }

    reset(emptyValues);
  }, [open, initialData, reset]);

  const submitForm = (values: FormValues) => {
    onSubmit({
      orsPrimarykeyOrde: initialData?.orsPrimarykeyOrde,
      orsIdentifkeyOrde: values.orsIdentifkeyOrde.trim().toUpperCase(),
      orsAutorifechaOrde: values.orsAutorifechaOrde,
      orsCodservicioSebs: values.orsCodservicioSebs.trim(),
      orsServiceventOrde: values.orsServiceventOrde.trim(),
      orsServiclugarOrde: values.orsServiclugarOrde.trim(),
      orsServicobjetoOrde: values.orsServicobjetoOrde.trim(),
      orsPlanfechiniOrde: values.orsPlanfechiniOrde,
      orsPlanfechfinOrde: values.orsPlanfechfinOrde,
      prvIdentifkeyMprv: values.prvIdentifkeyMprv.trim(),
      prvIdentifkeyRelg: values.prvIdentifkeyRelg.trim() || null,
      orsValorbaseOrde: toOptionalNumber(values.orsValorbaseOrde),
      orsValordeivaOrde: toOptionalNumber(values.orsValordeivaOrde),
      orsValortotalOrde: toOptionalNumber(values.orsValortotalOrde),
      orsTiporegistOrde: values.orsTiporegistOrde || "1",
      orsEstadoregOrde: (values.orsEstadoregOrde || "1") as EstadoRegistro
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        {initialData ? "Editar orden de servicio" : "Crear orden de servicio"}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(submitForm)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código orden"
                placeholder="ORDE-0001"
                error={Boolean(errors.orsIdentifkeyOrde)}
                helperText={errors.orsIdentifkeyOrde?.message}
                {...register("orsIdentifkeyOrde", {
                  required: "El código de la orden es obligatorio"
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Código servicio"
                placeholder="SERV-0001"
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

            <Grid size={{ xs: 12, md: 6 }}>
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
                {...register("orsServicobjetoOrde")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha inicio plan"
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
                label="Fecha fin plan"
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
                placeholder="PRV-0001"
                {...register("prvIdentifkeyMprv")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Representante legal"
                placeholder="Opcional"
                {...register("prvIdentifkeyRelg")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor base"
                {...register("orsValorbaseOrde", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor IVA"
                {...register("orsValordeivaOrde", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Valor total"
                {...register("orsValortotalOrde", {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tipo registro interno"
                placeholder="1"
                {...register("orsTiporegistOrde")}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Estado"
                placeholder="1"
                {...register("orsEstadoregOrde")}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}