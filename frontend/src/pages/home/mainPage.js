import React, { useState } from "react";
import { useLogout } from "../../hooks/auth/useLogout";
import Navbar from "../../components/navbar.js";
import { useApi } from "../../hooks/api/useApi";
import { Box } from "@mui/material";
import Feed from "../../components/feed";
import Tags from "../../components/tags";

export default function MainPage() {
  const { logout, isPending } = useLogout();
  const [tag, setTag] = useState([]);
  const [effectRunFromModal, seteffectRunFromModal] = useState(false);
  

  return (
    //TODO: tags and newPostModal
      <Box sx={{ backgroundColor: "background.myBackground" }}>
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
