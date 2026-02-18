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
import AddRole from "./AddRole";
import RoleDeleteModal from "./RoleDeleteModal";

interface Role {
  roleID: number;
  roleName: string;
  isActive: boolean;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
};

const RoleList = () => {
  const [data, setData] = useState<Role[]>([]);
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
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await jwtAxios.get("/Role/GetRoles");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await jwtAxios.post(`/Role/DeleteRole?roleID=${deleteId}`);

      showSnackbar(res.data.message);
      setDeleteOpen(false);
      fetchRoles();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Delete failed";

      showSnackbar(message, "error");
      setDeleteOpen(false);
    }
  };

  const columns :MRT_ColumnDef<Role>[]= [
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
                setSelectedId(row.original.roleID);
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
                setDeleteId(row.original.roleID);
                setDeleteName(row.original.roleName);
                setDeleteOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
      { accessorKey: "roleName", header: "Role Name" },
      {
        accessorKey: "isActive",
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
          width: "90%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Role List</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: "#212529" }}
            onClick={() => {
              setSelectedId(null);
              setIsEditMode(false);
              setOpen(true);
            }}
          >
            Add Role
          </Button>
        </Box>

        <MaterialReactTable
          columns={columns}
          data={data}
          state={{ isLoading: loading }}
          enableStickyHeader
          enableRowVirtualization
          enablePagination={false}
          initialState={{ density: "compact", showColumnFilters: true }}
          muiTableContainerProps={{ sx: { maxHeight: 450 } }}
        />
      </Box>

      <RoleDeleteModal
        open={deleteOpen}
        roleName={deleteName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader
              title={isEditMode ? "Edit Role" : "Add Role"}
              titleTypographyProps={{ variant: "body1" }}
              sx={{ bgcolor: "#212529", color: "white", py: 1 }}
            />
            <CardContent>
              <AddRole
                roleId={selectedId}
                isEditMode={isEditMode}
                closeModal={() => {
                  setOpen(false);
                  fetchRoles();
                }}
                onSuccess={showSnackbar}
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
};

export default RoleList;
