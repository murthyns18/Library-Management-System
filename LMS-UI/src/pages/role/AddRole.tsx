import { Box, Button, Grid, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtAxios from "../../utils/axios";
import { useEffect } from "react";

interface Props {
  roleId: number | null;
  isEditMode: boolean;
  closeModal: () => void;
  onSuccess: (msg: string) => void;
}

interface FormValues {
  roleName: string;
  isActive: boolean;
}

const schema = yup.object({
  roleName: yup.string().required("Please enter Role Name"),
});

const AddRole: React.FC<Props> = ({ roleId, isEditMode, closeModal, onSuccess }) => {

  const { control, handleSubmit, reset, setError, formState: { errors } }
    = useForm<FormValues>({
      resolver: yupResolver(schema),
      defaultValues: {
        roleName: "",
        isActive: true,
      },
    });

  useEffect(() => {
    if (isEditMode && roleId) fetchById(roleId);
    else reset({ roleName: "", isActive: true });
  }, [roleId, isEditMode]);

  const fetchById = async (id: number) => {
    const res = await jwtAxios.get(`/Role/GetRoles?roleID=${id}`);
    const data = res.data[0];
    if (!data) return;
    reset({
      roleName: data.roleName,
      isActive: data.isActive,

    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await jwtAxios.post("/Role/SaveRole", {
        ...data,
        roleID: roleId ?? 0,
      });

      const message = res.data.message || "";

      if (message.toLowerCase().includes("already exists")) {
        setError("roleName", { type: "server", message });
        return;
      }

      onSuccess(message);
      closeModal();

    } catch (err: any) {
      setError("roleName", {
        type: "server",
        message: err?.response?.data?.message || "Error occurred",
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="roleName" control={control}
            render={({ field }) => (
              <TextField {...field} label="Role Name" fullWidth size="small"
                error={!!errors.roleName}
                helperText={errors.roleName?.message} />
            )}
          />
        </Grid>

        {isEditMode && (
          <Grid size={12}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Controller name="isActive" control={control}
                render={({ field }) => (
                  <RadioGroup row value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "true")}>
                    <FormControlLabel value="true" control={<Radio size="small" />} label="Active" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="Inactive" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 2 }}>
        <Button size="small" variant="outlined" onClick={closeModal}>Cancel</Button>
        <Button size="small" type="submit" variant="contained">
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddRole;
