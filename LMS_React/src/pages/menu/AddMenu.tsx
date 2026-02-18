import React, { useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import jwtAxios from "../../utils/axios";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from "@mui/material";

interface Props {
  closeModal: () => void;
  menuId: number | null;
  isEditMode: boolean;
  onSuccess: (message: string) => void;
}

interface FormValues {
  menuId: number;
  menuName: string;
  displayName: string;
  menuUrl: string;
  menuLevel: number;
  displayOrder: number;
  isActive: boolean;
}

const schema = yup.object({
  menuId: yup
    .number()
    .typeError("Please enter Menu Id")
    .required("Please enter Menu Id"),
  menuName: yup.string().required("Please enter Menu Name"),
  displayName: yup.string().required("Please enter Display Name"),
  menuUrl: yup.string().required("Please enter Menu URL"),
  menuLevel: yup
    .number()
    .typeError("Please enter Menu Level")
    .required("Please enter Menu Level"),
  displayOrder: yup
    .number()
    .typeError("Please enter Display Order")
    .required("Please enter Display Order"),
});

export default function AddMenu({
  closeModal,
  menuId,
  isEditMode,
  onSuccess,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      menuId: 0,
      menuName: "",
      displayName: "",
      menuUrl: "",
      menuLevel: 1,
      displayOrder: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isEditMode && menuId) fetchMenuById(menuId);
    else
      reset({
        menuId: 0,
        menuName: "",
        displayName: "",
        menuUrl: "",
        menuLevel: 1,
        displayOrder: 1,
        isActive: true,
      });
  }, [menuId, isEditMode]);

  const fetchMenuById = async (id: number) => {
    const res = await jwtAxios.get(`/Menu/MenuList?menuId=${id}`);
    const menu = res.data[0];
    if (!menu) return;

    reset({
      menuId: menu.menuId ?? 0,
      menuName: menu.menuName ?? "",
      displayName: menu.displayName ?? "",
      menuUrl: menu.menuUrl ?? "",
      menuLevel: menu.menuLevel ?? 1,
      displayOrder: menu.displayOrder ?? 1,
      isActive: menu.isActive ?? true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await jwtAxios.post("/Menu/SaveMenu", data);
      onSuccess(res.data.message);
      closeModal();
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Controller
            name="menuId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Menu Id"
                fullWidth
                size="small"
                error={!!errors.menuId}
                helperText={errors.menuId?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="menuName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Menu Name"
                fullWidth
                size="small"
                error={!!errors.menuName}
                helperText={errors.menuName?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Display Name"
                fullWidth
                size="small"
                error={!!errors.displayName}
                helperText={errors.displayName?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="menuUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Menu Url"
                fullWidth
                size="small"
                error={!!errors.menuUrl}
                helperText={errors.menuUrl?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="menuLevel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Menu Level"
                fullWidth
                size="small"
                error={!!errors.menuLevel}
                helperText={errors.menuLevel?.message}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="displayOrder"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Display Order"
                fullWidth
                size="small"
                error={!!errors.displayOrder}
                helperText={errors.displayOrder?.message}
              />
            )}
          />
        </Grid>

        {isEditMode && (
          <Grid size={12}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Status</FormLabel>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio size="small" />}
                      label="Active"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                      }}
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio size="small" />}
                      label="Inactive"
                      sx={{
                        "& .MuiFormControlLabel-label": { fontSize: "0.9rem" },
                      }}
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1 }}>
        <Button size="small" variant="outlined" onClick={closeModal}>
          Cancel
        </Button>
        <Button size="small" type="submit" variant="contained">
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}
