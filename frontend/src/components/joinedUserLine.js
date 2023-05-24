import { Avatar, Button, Stack, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function JoinedUsersLine({
  effect,
  aFollower,
  seteffect,
  _id,
  effectRun,
  seteffectRun,
}) {
  const navigate = useNavigate();
  const handleNavigateClick = (cognitoId) => {
    navigate(`/userprofile/${cognitoId}`);
  };
  const { user } = useAuthContext();
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const unjoinPost = async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        `${url}join/leavePost?userId=${aFollower._id}&postId=${_id}`,
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
