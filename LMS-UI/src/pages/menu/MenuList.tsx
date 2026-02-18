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
import AddMenu from "./AddMenu";
import MenuDeleteModal from "./MenuDeleteModal";

interface Menu {
  menuId: number;
  menuName: string;
  displayName: string;
  menuUrl: string;
  menuLevel: number;
  displayOrder: number;
  isActive: boolean;
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

const MenuList = () => {
  const [data, setData] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteMenuId, setDeleteMenuId] = useState<number | null>(null);
  const [deleteMenuName, setDeleteMenuName] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">(
    "success",
  );

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const { data } = await jwtAxios.get("/Menu/MenuList");
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteMenuId) return;
    try {
      const res = await jwtAxios.post("/Menu/DeleteMenu", deleteMenuId, {
        headers: { "Content-Type": "application/json" },
      });
      showSnackbar(res.data.message);
      setDeleteOpen(false);
      fetchMenus();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const columns :MRT_ColumnDef<Menu>[] = [
      {
        header: "Action",
        size: 90,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              color="warning"
              onClick={() => {
                setSelectedMenuId(row.original.menuId);
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
                setDeleteMenuId(row.original.menuId);
                setDeleteMenuName(row.original.menuName);
                setDeleteOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },

      { accessorKey: "menuName", header: "Menu Name" },
      { accessorKey: "displayName", header: "Display Name" },
      { accessorKey: "menuUrl", header: "Menu URL" },
      { accessorKey: "menuLevel", header: "Level" },
      { accessorKey: "displayOrder", header: "Order" },

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
      {/* ⭐ EXACT SAME CONTAINER AS BOOK LIST */}
      <Box
        sx={{
          height: "75vh",
          display: "flex",
          width: "90%",
          margin: "auto",
          flexDirection: "column",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">Menu List</Typography>

          <Button
            variant="contained"
            sx={{ bgcolor: "#212529" }}
            onClick={() => {
              setSelectedMenuId(null);
              setIsEditMode(false);
              setOpen(true);
            }}
          >
            Add Menu
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

      <MenuDeleteModal
        open={deleteOpen}
        menuName={deleteMenuName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader
              title={isEditMode ? "Edit Menu" : "Add Menu"}
              titleTypographyProps={{ variant: "body1" }}
              sx={{ bgcolor: "#212529", color: "white", py: 1 }}
            />
            <CardContent>
              <AddMenu
                menuId={selectedMenuId}
                isEditMode={isEditMode}
                closeModal={() => {
                  setOpen(false);
                  fetchMenus();
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

export default MenuList;
