import React, { useState } from "react";
import Navbar from "../../components/navbar.js";
import { Box } from "@mui/material";
import Feed from "../../components/feed";
import Tags from "../../components/tags";
import NewPostModal from "../../components/newPostModal";

export default function MainPage() {
  const [tag, setTag] = useState([]);
  const [effectRunFromModal, seteffectRunFromModal] = useState(false);
  return (
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
          <NewPostModal
            effectRunFromModal={effectRunFromModal}
            seteffectRunFromModal={seteffectRunFromModal}
          />
      </Box>
  );
}
