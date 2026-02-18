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

import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import jwtAxios from "../../utils/axios";
import AddLoan from "./AddLoan";
import LoanDeleteModal from "./LoanDeleteModal";

interface Loan {
  loanId: number;
  userName: string;
  totalQty: number;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
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

const LoanList = () => {
  const [data, setData] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoanId, setDeleteLoanId] = useState<number | null>(null);
  const [deleteUserName, setDeleteUserName] = useState("");

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
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const { data } = await jwtAxios.get("/Loan/LoanList?loanId=0");
      setData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteLoanId) return;
    try {
      const res = await jwtAxios.post("/Loan/DeleteLoan", deleteLoanId, {
        headers: { "Content-Type": "application/json" },
      });
      showSnackbar(res.data.message);
      setDeleteOpen(false);
      fetchLoans();
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      const res = await jwtAxios.post("/Loan/ReturnLoan", loanId, {
        headers: { "Content-Type": "application/json" },
      });
      showSnackbar(res.data.message);
      fetchLoans();
    } catch {
      showSnackbar("Return failed", "error");
    }
  };

  const columns : MRT_ColumnDef<Loan>[]=[
      {
        header: "Action",
        size: 90,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box display="flex" gap={0.5}>
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setDeleteLoanId(row.original.loanId);
                setDeleteUserName(row.original.userName);
                setDeleteOpen(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            {row.original.status === "Active" && (
              <IconButton
                size="small"
                color="success"
                onClick={() => handleReturn(row.original.loanId)}
              >
                <KeyboardReturnIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ),
      },
      { accessorKey: "userName", header: "User Name" },
      { accessorKey: "totalQty", header: "Total Qty" },
      { accessorKey: "loanDate", header: "Loan Date" },
      { accessorKey: "dueDate", header: "Due Date" },
      {
        accessorKey: "returnDate",
        header: "Return Date",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue()
          ) : (
            <span style={{ color: "red" }}>Not Returned</span>
          ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) =>
          cell.getValue() === "Closed" ? (
            <Chip label="Closed" size="small" />
          ) : (
            <Chip label="Active" color="success" size="small" />
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
          flexDirection: "column",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">Loan List</Typography>

          <Button
            variant="contained"
            sx={{ bgcolor: "#212529" }}
            onClick={() => setOpen(true)}
          >
            Add Loan
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

      <LoanDeleteModal
        open={deleteOpen}
        userName={deleteUserName}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Card>
            <CardHeader
              title="Add Loan"
              titleTypographyProps={{ variant: "body1" }}
              sx={{
                bgcolor: "#212529",
                color: "white",
                py: 1,
                fontSize: "1.1rem",
              }}
            />
            <CardContent>
              <AddLoan
                closeModal={() => {
                  setOpen(false);
                  fetchLoans();
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
};

export default LoanList;
