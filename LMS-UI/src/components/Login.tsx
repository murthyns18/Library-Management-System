import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import jwtAxios from "../utils/axios";
import { setAuthToken } from "../utils/setAuthToken";

interface LoginForm {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup
    .string()
    .required("Please enter Email")
    .email("Please enter a valid Email"),
  password: yup
    .string()
    .required("Please enter Password")
    .min(4, "Minimum 4 characters"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: LoginForm) => {
    try {
      const { data } = await jwtAxios.post("/token", {
        Email: formData.email,
        Password: formData.password,
      });

      const { access_token, user, menuDetails } = data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("menu", JSON.stringify(menuDetails));

      setAuthToken(access_token);

      setSuccess(true);
      setOpen(true);
    } catch {
      setSuccess(false);
      setOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Card sx={{ width: 350, p: 4, textAlign: "center", borderRadius: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#212529",
              width: 60,
              height: 60,
              mx: "auto",
              mb: 2,
            }}
          >
            <Person />
          </Avatar>

          <Typography variant="h6" mb={3}>
            Sign in to LMS
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, bgcolor: "#212529" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Card>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => {
          setOpen(false);
          if (success) navigate("/dashboard/book/booklist");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={success ? "success" : "error"} variant="filled">
          {success
            ? "Login Successful ✅"
            : "Invalid username or password ❌"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
