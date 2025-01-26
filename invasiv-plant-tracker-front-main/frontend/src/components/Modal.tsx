import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  maxHeight: "90vh",
  bgcolor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  p: { xs: 2, sm: 3 },
  outline: "none",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  borderRadius: "8px",
  textTransform: "none",
  padding: "8px 16px",
  fontSize: "1rem",
  fontWeight: 500,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#43A047",
  },
};

interface BasicModalProps {
  handleOpen: () => void;
  handleClose: () => void;
  open: boolean;
  children: React.ReactNode;
  buttonText?: string;
}

export const BasicModal: React.FC<BasicModalProps> = ({
  handleClose,
  handleOpen,
  open,
  children,
  buttonText = "Open Modal"
}) => {
  return (
    <div>
      <Button 
        onClick={handleOpen}
        sx={buttonStyle}
      >
        {buttonText}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box sx={modalStyle}>
          {children}
        </Box>
      </Modal>
    </div>
  );
};
