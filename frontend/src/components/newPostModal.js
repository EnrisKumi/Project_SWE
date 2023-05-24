import React, { useContext, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import {
  Box,
  Fab,
  Modal,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import NewPostModalNewPage from "./newPostModalNewPage";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

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
  const navigate = useNavigate();
  const [value, setValue] = useState(dayjs());
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [text, setText] = useState("");
  const [limit, setLimit] = useState("");
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState();
  // const [cognitoId, setcognitoId] = useState();
  // const [mongoId, setmongoId] = useState();
  const [isposting, setisposting] = useState(false);
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const handleNavigateClick = () => {
    navigate("/newpost");
  };

  const clear = () => {
    setLimit("");
    setText("");
    setTag([]);
  };

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
        matches ? setOpen(true) : handleNavigateClick();
        setTag([]);
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
