import {
  Box, Button, Grid, TextField, MenuItem,
  RadioGroup, FormControlLabel, Radio,
  Checkbox, FormControl, FormLabel
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import jwtAxios from "../../utils/axios";
import { useEffect, useState } from "react";

interface Props {
  userId: number | null;
  isEditMode: boolean;
  closeModal: () => void;
  onSuccess: (msg: string) => void;
}

export default function AddUser({ userId, isEditMode, closeModal, onSuccess }: Props) {

  const [roles, setRoles] = useState<any[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      mobileNumber: "",
      roleID: "",
      gender: "",
      password: "",
      confirmPassword: "",
      status: true,
      termsAccepted: false,
      address: ""
    }
  });

  useEffect(() => {
    fetchRoles();
    if (isEditMode && userId) fetchById(userId);
  }, [userId, isEditMode]);

  const fetchRoles = async () => {
    const res = await jwtAxios.get("/Role/RoleList");
    setRoles(res.data);
  };

  const fetchById = async (id: number) => {
    const res = await jwtAxios.get(`/User/UserList?userID=${id}`);
    reset(res.data[0]);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.keys(data).forEach(k => formData.append(k, data[k]));

    formData.append("LanguagesKnownCsv", languages.join(","));
    formData.append("InterestedCategoriesCsv", categories.join(","));

    const res = await jwtAxios.post("/User/SaveUser", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    onSuccess(res.data.message);
    closeModal();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>

        <Grid size={4}>
          <Controller name="userName" control={control}
            render={({ field }) => <TextField {...field} label="User Name" fullWidth size="small" />}
          />
        </Grid>

        <Grid size={4}>
          <Controller name="email" control={control}
            render={({ field }) => <TextField {...field} label="Email" fullWidth size="small" />}
          />
        </Grid>

        <Grid size={4}>
          <Controller name="mobileNumber" control={control}
            render={({ field }) => <TextField {...field} label="Mobile" fullWidth size="small" />}
          />
        </Grid>

        <Grid size={4}>
          <Controller name="roleID" control={control}
            render={({ field }) => (
              <TextField {...field} select label="Role" fullWidth size="small">
                {roles.map(r => (
                  <MenuItem key={r.roleID} value={r.roleID}>
                    {r.roleName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={4}>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Controller name="gender" control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>

        {!isEditMode && (
          <>
            <Grid size={4}>
              <Controller name="password" control={control}
                render={({ field }) => <TextField {...field} type="password" label="Password" fullWidth size="small" />}
              />
            </Grid>

            <Grid size={4}>
              <Controller name="confirmPassword" control={control}
                render={({ field }) => <TextField {...field} type="password" label="Confirm Password" fullWidth size="small" />}
              />
            </Grid>
          </>
        )}

        {isEditMode && (
          <Grid size={4}>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Controller name="status" control={control}
                render={({ field }) => (
                  <RadioGroup row value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "true")}>
                    <FormControlLabel value="true" control={<Radio />} label="Active" />
                    <FormControlLabel value="false" control={<Radio />} label="Inactive" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        )}

        <Grid size={12}>
          <Controller name="termsAccepted" control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="I accept Terms & Conditions"
              />
            )}
          />
        </Grid>

      </Grid>

      <Box textAlign="right" mt={2}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    </Box>
  );
}
