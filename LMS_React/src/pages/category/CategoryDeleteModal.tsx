import { Modal, Box, Typography, Grid, Button, Backdrop, Fade } from "@mui/material";

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
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CategoryDeleteModal({ open, categoryName, onClose, onConfirm }: Props) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}>
      <Fade in={open}>
        <Box sx={style}>
          <Typography color="error" variant="h6">
            Are you sure you want to delete this category?
          </Typography>

          <Typography mt={1} fontWeight={500}>
            "{categoryName}"
          </Typography>

          <Grid container justifyContent="flex-end" gap={1} mt={3}>
            <Button size="small" variant="outlined" onClick={onClose}>Cancel</Button>
            <Button size="small" variant="contained" color="error" onClick={onConfirm}>
              Delete
            </Button>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
}
