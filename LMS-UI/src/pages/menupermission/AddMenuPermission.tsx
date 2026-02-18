import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtAxios from "../../utils/axios";

interface Props {
  closeModal: () => void;
  permissionId: number | null;
  isEditMode: boolean;
  onSuccess: (message: string) => void;
}

interface FormValues {
  menuRolePermissionID: number;
  menuId: number;
  roleID: number;
  isRead: boolean;
  isWrite: boolean;
}

/* ================= VALIDATION ================= */

const schema = yup.object({
  menuRolePermissionID: yup
    .number()
    .typeError("Enter permission id")
    .required("Permission id required"),

  menuId: yup
    .number()
    .moreThan(0, "Select menu")
    .required("Menu required"),

  roleID: yup
    .number()
    .moreThan(0, "Select role")
    .required("Role required"),
});

/* ================= COMPONENT ================= */

export default function AddMenuPermission({
  closeModal,
  permissionId,
  isEditMode,
  onSuccess,
}: Props) {
  const [menus, setMenus] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      menuRolePermissionID: 0,
      menuId: 0,
      roleID: 0,
      isRead: false,
      isWrite: false,
    },
  });

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    if (isEditMode && permissionId) fetchById(permissionId);
    else reset();
  }, [permissionId, isEditMode]);

  const loadDropdowns = async () => {
    const menuRes = await jwtAxios.get("/Menu/MenuList");
    const roleRes = await jwtAxios.get("/Role/GetRoles");
    setMenus(menuRes.data);
    setRoles(roleRes.data);
  };

  const fetchById = async (id: number) => {
    const res = await jwtAxios.get(
      `/MenuPermission/PermissionList?permissionId=${id}`
    );
    const item = res.data[0];

    reset({
      menuRolePermissionID: item.menuRolePermissionID,
      menuId: item.menuId,
      roleID: item.roleID,
      isRead: item.isRead,
      isWrite: item.isWrite,
    });
  };

  const onSubmit = async (data: FormValues) => {
    const res = await jwtAxios.post("/MenuPermission/SavePermission", data);
    onSuccess(res.data.message);
    closeModal();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

        {/* Permission ID */}
        <Grid size={6}>
          <Controller
            name="menuRolePermissionID"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Permission ID"
                type="number"
                fullWidth
                size="small"
                error={!!errors.menuRolePermissionID}
                helperText={errors.menuRolePermissionID?.message}
              />
            )}
          />
        </Grid>

        {/* Menu */}
        <Grid size={6}>
          <Controller
            name="menuId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Menu"
                fullWidth
                size="small"
                error={!!errors.menuId}
                helperText={errors.menuId?.message}
              >
                <MenuItem value={0}>Select</MenuItem>
                {menus.map((m) => (
                  <MenuItem key={m.menuId} value={m.menuId}>
                    {m.menuName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Role */}
        <Grid size={6}>
          <Controller
            name="roleID"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Role"
                fullWidth
                size="small"
                error={!!errors.roleID}
                helperText={errors.roleID?.message}
              >
                <MenuItem value={0}>Select</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r.roleID} value={r.roleID}>
                    {r.roleName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        {/* Checkboxes */}
        <Grid size={12}>
          <Controller
            name="isRead"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Read Permission"
              />
            )}
          />

          <Controller
            name="isWrite"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Write Permission"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 2 }}>
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
