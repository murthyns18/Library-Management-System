import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface Props {
  open: boolean;
  bookTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BookDeleteModal({
  open,
  bookTitle,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography sx={{ color: "error.main" }} variant="h6">
            Are you sure you want to delete this book?
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: 500 }}>
            "{bookTitle}"
          </Typography>

          <Grid container justifyContent="flex-end" gap={1} mt={3}>
            <Button size="small" variant="outlined" onClick={onClose}>
              Cancel
            </Button>

            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}
