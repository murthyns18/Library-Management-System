import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box, Chip, IconButton, Button, Typography,
  Modal, Card, CardHeader, CardContent,
  Snackbar, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import jwtAxios from "../../utils/axios";
import AddCategory from "./AddCategory";
import CategoryDeleteModal from "./CategoryDeleteModal";

interface Category {
  categoryID: number;
  categoryName: string;
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

const CategoryList = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (msg: string, severity: "success" | "error" = "success") => {
    setSnackMessage(msg);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await jwtAxios.get("/Category/CategoryList");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await jwtAxios.post("/Category/DeleteCategory", {
        categoryID: deleteId,
        forceDelete: false
      });
      showSnackbar(res.data.message);
      setDeleteOpen(false);
      fetchCategories();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };
const columns: MRT_ColumnDef<Category>[] = [
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
            setSelectedId(row.original.categoryID);
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
            setDeleteId(row.original.categoryID);
            setDeleteName(row.original.categoryName);
            setDeleteOpen(true);
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category Name",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    Cell: ({ cell }) =>
      cell.getValue<boolean>()
        ? <Chip label="Active" color="success" size="small" />
        : <Chip label="Inactive" color="error" size="small" />,
  },
];

  return (
    <>
      <Box sx={{ height: "75vh", width: "90%", margin: "auto", display: "flex", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">Category List</Typography>
          <Button variant="contained" sx={{ bgcolor: "#212529" }}
            onClick={() => {
              setSelectedId(null);
              setIsEditMode(false);
              setOpen(true);
            }}>
            Add Category
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

      <CategoryDeleteModal
        open={deleteOpen}
        categoryName={deleteName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader
              title={isEditMode ? "Edit Category" : "Add Category"}
              titleTypographyProps={{ variant: "body1" }}
              sx={{ bgcolor: "#212529", color: "white", py: 1 }}
            />
            <CardContent>
              <AddCategory
                categoryId={selectedId}
                isEditMode={isEditMode}
                closeModal={() => { setOpen(false); fetchCategories(); }}
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

export default CategoryList;
