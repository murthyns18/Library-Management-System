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
import AddBook from "./AddBook";
import BookDeleteModal from "./BookDeleteModal";

interface Book {
  bookID: number;
  title: string;
  price: number;
  quantity: number;
  publisherName: string;
  categoryName: string;
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

const BookList = () => {
  const [data, setData] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await jwtAxios.get("/Book/BookList");
      setData(data);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;
    try {
      const res = await jwtAxios.post("/Book/DeleteBook", deleteBookId, {
        headers: { "Content-Type": "application/json" },
      });
      showSnackbar(res.data.message);
      setDeleteOpen(false);
      fetchBooks();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const columns:MRT_ColumnDef<Book>[] = [
    {
      header: "Action",
      size: 90,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => (
        <Box display="flex" gap={0.5}>
          <IconButton size="small" color="warning"
            onClick={() => {
              setSelectedBookId(row.original.bookID);
              setIsEditMode(true);
              setOpen(true);
            }}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" color="error"
            onClick={() => {
              setDeleteBookId(row.original.bookID);
              setDeleteBookTitle(row.original.title);
              setDeleteOpen(true);
            }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "publisherName", header: "Publisher" },
    { accessorKey: "categoryName", header: "Category" },
    {
      accessorKey: "isActive",
      header: "Status",
      Cell: ({ cell }) =>
        cell.getValue<boolean>()
          ? <Chip label="Active" color="success" size="small" />
          : <Chip label="Inactive" color="error" size="small" />
    },
  ];

  return (
    <>
      <Box sx={{ height: "75vh", display: "flex", width: "90%", margin: "auto", flexDirection: "column" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">Book List</Typography>
          <Button variant="contained" sx={{ bgcolor: "#212529" }}
            onClick={() => { setSelectedBookId(null); setIsEditMode(false); setOpen(true); }}>
            Add Book
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

      <BookDeleteModal
        open={deleteOpen}
        bookTitle={deleteBookTitle}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader title={isEditMode ? "Edit Book" : "Add Book"}
            titleTypographyProps={{ variant: "body1" }}
              sx={{ bgcolor: "#212529", color: "white", py: 1, fontSize:"1.1rem" }} />
            <CardContent>
              <AddBook
                bookId={selectedBookId}
                isEditMode={isEditMode}
                closeModal={() => { setOpen(false); fetchBooks(); }}
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
        <Alert severity={snackSeverity} variant="filled">{snackMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default BookList;
