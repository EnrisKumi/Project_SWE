import React, { useState } from "react";
import { useLogout } from "../../hooks/auth/useLogout";
import Navbar from "../../components/navbar.js";
import { useApi } from "../../hooks/api/useApi";
import { Box } from "@mui/material";
import Feed from "../../components/feed";
import Tags from "../../components/tags";
import { useAuthContext } from "../../hooks/auth/useAuthContext";

export default function MainPage() {
  const { logout, isPending } = useLogout();
  const [tag, setTag] = useState([]);
  const [effectRunFromModal, seteffectRunFromModal] = useState(false);
  
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;

  return (
    //TODO: newPostModal
      <Box sx={{ backgroundColor: "background.myBackground" }}>
      <button className="btn" onClick={logout}>Logout</button>
      <div>{cognitoId}{mongoId}</div>
        <Navbar called="main" />
        <Tags called="main" tag={tag} setTag={setTag} />
          <Feed
            called="main"
            effectRunFromModal={effectRunFromModal}
            seteffectRunFromModal={seteffectRunFromModal}
            tag={tag}
            setTag={setTag}
          />
      </Box>
  );
}
