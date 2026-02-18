import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import jwtAxios from "../../utils/axios";

interface Props {
  closeModal: () => void;
  onSuccess: (msg: string) => void;
}

interface BookItem {
  bookId: number;
  bookName: string;
  publisherName: string;
}

export default function AddLoan({ closeModal, onSuccess }: Props) {

  const [users, setUsers] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [userDetails, setUserDetails] = useState<any>({});

  const [publisherId, setPublisherId] = useState<number | "">("");
  const [bookId, setBookId] = useState<number | "">("");

  const [selectedBooks, setSelectedBooks] = useState<BookItem[]>([]);

  const loadUsers = async () => {
    const res = await jwtAxios.get("/User/UserList?userID=-1");
    setUsers(res.data);
  };

  const loadUserDetails = async (id: number) => {
    const res = await jwtAxios.get(`/User/UserList?userID=${id}`);
    setUserDetails(res.data[0] || {});
  };


  const loadPublishers = async () => {
    const res = await jwtAxios.get("/Publisher/PublisherList?publisherID=-1");
    setPublishers(res.data);
  };

  const loadBooks = async (publisherId: number) => {
    const res = await jwtAxios.get(`/Book/GetBooksByPublisher?publisherId=${publisherId}`);
    setBooks(res.data);
  };


  const addBook = () => {

    if (!bookId) {
      alert("Please select book");
      return;
    }

    if (selectedBooks.length >= 4) {
      alert("Maximum 4 books allowed");
      return;
    }

    if (selectedBooks.some(b => b.bookId === bookId)) {
      alert("Book already added");
      return;
    }

    const book = books.find(b => b.bookID === bookId);
    const publisher = publishers.find(p => p.publisherID === publisherId);

    setSelectedBooks(prev => [
      ...prev,
      {
        bookId: book.bookID,
        bookName: book.title,
        publisherName: publisher.publisherName
      }
    ]);

    setPublisherId("");
    setBookId("");
    setBooks([]);
  };

  const removeBook = (id: number) => {
    setSelectedBooks(prev => prev.filter(b => b.bookId !== id));
  };


  const submitLoan = async () => {

    if (!selectedUser) {
      alert("Please select user");
      return;
    }

    if (selectedBooks.length === 0) {
      alert("Add at least one book");
      return;
    }

    const payload = {
      userId: selectedUser,
      loanDetails: selectedBooks.map(b => ({
        bookId: b.bookId,
        qty: 1
      }))
    };

    const res = await jwtAxios.post("/Loan/CreateLoan", payload);

    onSuccess(res.data.message);
    closeModal();
  };


  useEffect(() => {
    loadUsers();
    loadPublishers();
  }, []);

  useEffect(() => {
    if (selectedUser) loadUserDetails(selectedUser as number);
  }, [selectedUser]);

  useEffect(() => {
    if (publisherId) loadBooks(publisherId as number);
  }, [publisherId]);


  return (
    <Box>

    
      <Card sx={{ mb: 2 }}>
        <CardHeader title="User Details" sx={{ py: 1 }} />
        <CardContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>

            <Grid size={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="User"
                value={selectedUser}
                onChange={e => setSelectedUser(Number(e.target.value))}
              >
                <MenuItem value="">Select</MenuItem>
                {users.map(u => (
                  <MenuItem key={u.userID} value={u.userID}>
                    {u.userName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={4}>
              <TextField size="small" fullWidth label="Name" value={userDetails.userName || ""} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid size={4}>
              <TextField size="small" fullWidth label="Email" value={userDetails.email || ""} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid size={4}>
              <TextField size="small" fullWidth label="Address" value={userDetails.address || ""} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid size={4}>
              <TextField size="small" fullWidth label="Mobile" value={userDetails.mobileNumber || ""} InputProps={{ readOnly: true }} />
            </Grid>

          </Grid>
        </CardContent>
      </Card>

    
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Add Books (Max 4)" sx={{ py: 1 }} />
        <CardContent sx={{ pt: 1 }}>
          <Grid container spacing={2} alignItems="center">

            <Grid size={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Publisher"
                value={publisherId}
                onChange={e => setPublisherId(Number(e.target.value))}
              >
                <MenuItem value="">Select</MenuItem>
                {publishers.map(p => (
                  <MenuItem key={p.publisherID} value={p.publisherID}>
                    {p.publisherName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Book"
                value={bookId}
                onChange={e => setBookId(Number(e.target.value))}
              >
                <MenuItem value="">Select</MenuItem>
                {books.map(b => (
                  <MenuItem key={b.bookID} value={b.bookID}>
                    {b.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={2}>
              <TextField size="small" fullWidth label="Qty" value={1} InputProps={{ readOnly: true }} />
            </Grid>

            <Grid size={2}>
              <Button variant="contained" fullWidth onClick={addBook}>
                Add
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>


      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Book</TableCell>
            <TableCell>Publisher</TableCell>
            <TableCell align="center">Qty</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedBooks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No books added</TableCell>
            </TableRow>
          ) : (
            selectedBooks.map(b => (
              <TableRow key={b.bookId}>
                <TableCell>
                  <IconButton color="error" onClick={() => removeBook(b.bookId)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell>{b.bookName}</TableCell>
                <TableCell>{b.publisherName}</TableCell>
                <TableCell align="center">1</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

  
      <Box textAlign="right" mt={2}>
        <Button onClick={closeModal}>Cancel</Button>
        <Button variant="contained" onClick={submitLoan}>
          Submit
        </Button>
      </Box>

    </Box>
  );
}
