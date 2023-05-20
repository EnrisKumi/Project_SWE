import React from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";


export default function ChatNavbar() {
  return (
    <div className="nav-bar-chat">
    <Box marginLeft={3}>
      <img src="/hobby-chat.png" alt="yo" height={40} width={200} />
    </Box>
    <Box
      m={1}
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Button variant="contained" color="primary" href="/mainpage">
        Main page
      </Button>
    </Box>
  </div>
  )
}
