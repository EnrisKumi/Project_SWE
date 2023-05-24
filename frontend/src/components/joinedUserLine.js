import { Avatar, Button, Stack, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";

export default function JoinedUsersLine({
  effect,
  aFollower,
  seteffect,
  _id,
  effectRun,
  seteffectRun,
}) {
    const { user } = useAuthContext();
    const cognitoId = user.attributes.sub;
    const token = user.signInUserSession.idToken.jwtToken;
    const requestInfo = {
      headers: {
        Authorization: token,
      },
    };
  const navigate = useNavigate();
  const handleNavigateClick = (cognitoId) => {
    navigate(`/userprofile/${cognitoId}`);
  };

  const unjoinPost = async (e) => {
    e.preventDefault();

    try {
      await axios.get(
        `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/unjoinPost/${aFollower._id}/${_id}`,
        requestInfo
      );

      seteffect(!effect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      flexDirection="row"
      alignSelf="flex-start"
      alignItems="center"
      gap={2}
      width={1}
      padding={1}
    >
      <Stack flexDirection="row" alignItems="center" gap={2}>
        <Avatar
          onClick={(e) => handleNavigateClick(aFollower?.userCognitoId)}
          src={aFollower.prfilePicture}
          sx={{
            bgcolor: `red`,
            textDecoration: "none",
            width: "30px",
            height: "30px",
            marginRight: "auto",
          }}
          aria-label="recipe"
        >
          {aFollower?.username.substring(0, 1)}
        </Avatar>

        <Typography
          onClick={(e) => handleNavigateClick(aFollower?.userCognitoId)}
          sx={{ textDecoration: "none", color: "text.primary" }}
          marginRight={1}
          fontWeight={600}
        >
          {aFollower?.username}
        </Typography>
      </Stack>
      <Button
        sx={{ marginLeft: "auto" }}
        color="error"
        onClick={(e) => {
          unjoinPost(e, aFollower._id);
        }}
      >
        {" "}
        Delete
      </Button>
    </Stack>
  );
}
