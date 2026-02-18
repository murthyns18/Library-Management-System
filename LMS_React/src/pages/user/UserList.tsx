import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Chip,
  IconButton,
  Button,
  Typography,
  Modal,
  Card,
  CardHeader,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import jwtAxios from "../../utils/axios";
import AddUser from "./AddUser";
import UserDeleteModal from "./UserDeleteModal";

interface User {
  userID: number;
  userName: string;
  email: string;
  mobileNumber: string;
  roleName: string;
  gender: string;
  status: boolean;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

export default function UserList() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">(
    "success",
  );

  const showSnackbar = (
    msg: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await jwtAxios.get("/User/UserList");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await jwtAxios.post(`/User/DeleteUser?userID=${deleteId}`);
      const isError = !res.data.success;

      showSnackbar(res.data.message, isError ? "error" : "success");

      if (!isError) {
        setDeleteOpen(false);
        fetchUsers();
      }
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const columns:MRT_ColumnDef<User>[]=[
      {
        header: "Action",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              color="warning"
              onClick={() => {
                setSelectedId(row.original.userID);
                setIsEditMode(true);
                setOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setDeleteId(row.original.userID);
                setDeleteName(row.original.userName);
                setDeleteOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
      { accessorKey: "userName", header: "User Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "mobileNumber", header: "Mobile" },
      { accessorKey: "roleName", header: "Role" },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) =>
          cell.getValue<boolean>() ? (
            <Chip label="Active" color="success" size="small" />
          ) : (
            <Chip label="Inactive" color="error" size="small" />
          ),
      },
    ];

  return (
<>
  <Box
    sx={{
      height: "75vh",
      display: "flex",
      width: "90%",
      margin: "auto",
      flexDirection: "column"
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={1}
    >
      <Typography variant="h6">User List</Typography>

      <Button
        variant="contained"
        sx={{ bgcolor: "#212529" }}
        onClick={() => {
          setSelectedId(null);
          setIsEditMode(false);
          setOpen(true);
        }}
      >
        Add User
      </Button>
    </Box>

    <Box sx={{ height: 500, overflow: "hidden" }}>
      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableColumnFilters
        enableSorting
        enableStickyHeader
        enableRowVirtualization
        enablePagination={false}
        initialState={{ density: "compact", showColumnFilters: true }}
        muiTableContainerProps={{ sx: { maxHeight: 450 } }}
      />
    </Box>
  </Box>

  <UserDeleteModal
    open={deleteOpen}
    userName={deleteName}
    onClose={() => setDeleteOpen(false)}
    onConfirm={handleDelete}
  />

  <Modal open={open} onClose={() => setOpen(false)}>
    <Box sx={modalStyle}>
      <Card>
        <CardHeader
          title={isEditMode ? "Edit User" : "Add User"}
          titleTypographyProps={{ variant: "body1" }}
          sx={{
            bgcolor: "#212529",
            color: "white",
            py: 1,
            fontSize: "1.1rem"
          }}
        />
        <CardContent>
          <AddUser
            userId={selectedId}
            isEditMode={isEditMode}
            closeModal={() => {
              setOpen(false);
              fetchUsers();
            }}
            onSuccess={(msg) => showSnackbar(msg)}
          />
        </CardContent>
      </Card>
    </Box>
  </Modal>

  <Snackbar
    open={snackOpen}
    autoHideDuration={2000}
    onClose={() => setSnackOpen(false)}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert severity={snackSeverity} variant="filled">
      {snackMessage}
    </Alert>
  </Snackbar>
</>

  );
}
