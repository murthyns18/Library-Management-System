import { Box, Button, Grid, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtAxios from "../../utils/axios";
import { useEffect } from "react";

interface Props {
  categoryId: number | null;
  isEditMode: boolean;
  closeModal: () => void;
  onSuccess: (msg: string) => void;
}

interface FormValues {
  categoryName: string;
  isActive: boolean;
}

const schema = yup.object({
  categoryName: yup.string().required("Please enter Category Name"),
});

const AddCategory: React.FC<Props> = ({ categoryId, isEditMode, closeModal, onSuccess }) => {

  const { control, handleSubmit, reset, setError, formState: { errors } }
    = useForm<FormValues>({
      resolver: yupResolver(schema),
      defaultValues: {
        categoryName: "",
        isActive: true,
      },
    });

  useEffect(() => {
    if (isEditMode && categoryId) fetchById(categoryId);
    else reset({ categoryName: "", isActive: true });
  }, [categoryId, isEditMode]);

  const fetchById = async (id: number) => {
    const res = await jwtAxios.get(`/Category/CategoryList?categoryID=${id}`);
    const data = res.data[0];
    if (!data) return;
    reset({
      categoryName: data.categoryName,
      isActive: data.isActive,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await jwtAxios.post("/Category/SaveCategory", {
        ...data,
        categoryID: categoryId ?? 0,
      });

      const message = res.data.message || "";

      if (message.toLowerCase().includes("already exists")) {
        setError("categoryName", { type: "server", message });
        return;
      }

      onSuccess(message);
      closeModal();

    } catch (err: any) {
      setError("categoryName", {
        type: "server",
        message: err?.response?.data?.message || "Error occurred",
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="categoryName" control={control}
            render={({ field }) => (
              <TextField {...field} label="Category Name" fullWidth size="small"
                error={!!errors.categoryName}
                helperText={errors.categoryName?.message} />
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

export default AddCategory;
