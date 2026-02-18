import { Box, Button, Grid, TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import jwtAxios from "../../utils/axios";
import { useEffect } from "react";

interface Props {
  publisherId: number | null;
  isEditMode: boolean;
  closeModal: () => void;
  onSuccess: (msg: string) => void;
}

interface FormValues {
  publisherName: string;
  isActive: boolean;
}

const schema = yup.object({
  publisherName: yup.string().required("Please enter Publisher Name"),
});

const AddPublisher: React.FC<Props> = ({ publisherId, isEditMode, closeModal, onSuccess }) => {

  const { control, handleSubmit, reset, setError, formState: { errors } }
    = useForm<FormValues>({
      resolver: yupResolver(schema),
      defaultValues: {
        publisherName: "",
        isActive: true,
      },
    });

  useEffect(() => {
    if (isEditMode && publisherId) fetchById(publisherId);
    else reset({ publisherName: "", isActive: true });
  }, [publisherId, isEditMode]);

  const fetchById = async (id: number) => {
    const res = await jwtAxios.get(`/Publisher/PublisherList?publisherID=${id}`);
    const data = res.data[0];
    if (!data) return;
    reset({
      publisherName: data.publisherName,
      isActive: data.isActive,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await jwtAxios.post("/Publisher/SavePublisher", {
        ...data,
        publisherID: publisherId ?? 0,
      });

      const message = res.data.message || "";

      if (message.toLowerCase().includes("already exists")) {
        setError("publisherName", { type: "server", message });
        return;
      }

      onSuccess(message);
      closeModal();

    } catch (err: any) {
      setError("publisherName", {
        type: "server",
        message: err?.response?.data?.message || "Error occurred",
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="publisherName" control={control}
            render={({ field }) => (
              <TextField {...field} label="Publisher Name" fullWidth size="small"
                error={!!errors.publisherName}
                helperText={errors.publisherName?.message} />
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

export default AddPublisher;
