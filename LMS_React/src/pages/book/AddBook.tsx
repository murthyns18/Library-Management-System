import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, MenuItem } from "@mui/material";
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

interface Publisher {
  publisherID: string;
  publisherName: string;
}

interface Category {
  categoryID: string;
  categoryName: string;
}

interface FormValues {
  title: string;
  publisherID: string;
  categoryID: string;
  isbn: string;
  price: number;
  quantity: number;
  isActive: boolean;
}

interface Props {
  closeModal: () => void;
  bookId: number | null;
  isEditMode: boolean;
  onSuccess: (message: string) => void;  
}

const schema = yup.object({
  title: yup.string().required("Please enter Title"),
  publisherID: yup.string().required("Please select Publisher"),
  categoryID: yup.string().required("Please select Category"),
  isbn: yup.string().required("Please enter ISBN"),
  price: yup.number().typeError("Please enter Price").positive("Price must be greater than 0").required("Please enter Price"),
  quantity: yup.number().typeError("Please enter Quantity").positive("Quantity must be greater than 0").required("Please enter Quantity"),
});

const AddBook: React.FC<Props> = ({ closeModal, bookId, isEditMode, onSuccess }) => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      publisherID: "",
      categoryID: "",
      isbn: "",
      price: 0,
      quantity: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (isEditMode && bookId) fetchBookById(bookId);
    else
      reset({
        title: "",
        publisherID: "",
        categoryID: "",
        isbn: "",
        price: 0,
        quantity: 0,
        isActive: true,
      });
  }, [bookId, isEditMode]);

  const fetchDropdowns = async () => {
    const pubRes = await jwtAxios.get("/Publisher/PublisherList");
    const catRes = await jwtAxios.get("/Category/CategoryList");
    setPublishers(pubRes.data);
    setCategories(catRes.data);
  };

  const fetchBookById = async (id: number) => {
    const res = await jwtAxios.get(`/Book/BookList?bookID=${id}`);
    const book = res.data[0];
    if (!book) return;

    reset({
      title: book.title || "",
      publisherID: String(book.publisherId),
      categoryID: String(book.categoryId),
      isbn: book.isbn || "",
      price: book.price || 0,
      quantity: book.quantity || 0,
      isActive: book.isActive ?? true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await jwtAxios.post("/Book/SaveBook", {
        ...data,
        bookID: bookId ?? 0,
      });

      const message = res?.data?.message || "";

      if (message.toLowerCase().includes("already exists")) {
        setError("isbn", { type: "server", message });
        return;
      }

      onSuccess(message);  
      closeModal();

    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      setError("isbn", { type: "server", message });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Controller name="title" control={control}
            render={({ field }) => (
              <TextField {...field} label="Title" fullWidth size="small"
                error={!!errors.title} helperText={errors.title?.message} />
            )}
          />

          <Controller name="publisherID" control={control}
            render={({ field }) => (
              <TextField {...field} select label="Publisher" fullWidth size="small" sx={{ mt: 2 }}
                error={!!errors.publisherID} helperText={errors.publisherID?.message}>
                <MenuItem value="">Select</MenuItem>
                {publishers.map(p => (
                  <MenuItem key={p.publisherID} value={p.publisherID}>
                    {p.publisherName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller name="categoryID" control={control}
            render={({ field }) => (
              <TextField {...field} select label="Category" fullWidth size="small" sx={{ mt: 2 }}
                error={!!errors.categoryID} helperText={errors.categoryID?.message}>
                <MenuItem value="">Select</MenuItem>
                {categories.map(c => (
                  <MenuItem key={c.categoryID} value={c.categoryID}>
                    {c.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller name="isbn" control={control}
            render={({ field }) => (
              <TextField {...field} label="ISBN" fullWidth size="small"
                error={!!errors.isbn} helperText={errors.isbn?.message} />
            )}
          />

          <Controller name="price" control={control}
            render={({ field }) => (
              <TextField {...field} type="number" label="Price" fullWidth size="small" sx={{ mt: 2 }}
                error={!!errors.price} helperText={errors.price?.message} />
            )}
          />

          <Controller name="quantity" control={control}
            render={({ field }) => (
              <TextField {...field} type="number" label="Quantity" fullWidth size="small" sx={{ mt: 2 }}
                error={!!errors.quantity} helperText={errors.quantity?.message} />
            )}
          />
        </Grid>

        {isEditMode && (
          <Grid size={12}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel>Status</FormLabel>
              <Controller name="isActive" control={control}
                render={({ field }) => (
                  <RadioGroup row value={String(field.value)}
                    onChange={(e) => field.onChange(e.target.value === "true")}>
                    <FormControlLabel value="true" control={<Radio size="small" />} label="Active" sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.9rem", }, }} />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="Inactive" sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.9rem", }, }}/>
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, pt: 1 }}>
        <Button size="small" variant="outlined" onClick={closeModal}>Cancel</Button>
        <Button size="small" type="submit" variant="contained">
          {isEditMode ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddBook;
