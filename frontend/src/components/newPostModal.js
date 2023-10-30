import React, {  useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import {
  Fab,
  Modal,
  styled,
} from "@mui/material";
import NewPostModalNewPage from "./newPostModalNewPage";


const StyledModal = styled(Modal)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function NewPostModal({
  effectRunFromModal,
  seteffectRunFromModal,
  called,
}) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
    <Tooltip
      title="POST"
      sx={{
        position: "fixed",
        bottom: called === "UserProfile" ? 20 : 50,
        right: { xs: "calc(0% + 15px)", md: 30 },
      }}
      onClick={(e) => {
       setOpen(true) 
      }}
    >
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </Tooltip>
    <StyledModal
      open={open}
      onClose={(e) => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <NewPostModalNewPage
        calledd={called}
        seteffectRunFromModal={seteffectRunFromModal}
        effectRunFromModal={effectRunFromModal}
        setOpen={setOpen}
        called="NewPostModal"
      />
    </StyledModal>
  </>
  );
}
