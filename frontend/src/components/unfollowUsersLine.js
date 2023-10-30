import { Avatar, Button, Stack, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function UnFollowUsersLine({
  effect,
  aFollower,
  seteffect,
  _id,
  checkId,
  userDetailsEffect,
  setuserDetailsEffect,
  followedEffect,
  setfollowedEffect,
  seteffectRun,
  effectRun,
  setFollowersU,
  settabValue,
  tabValue,
}) {
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };
  const navigate = useNavigate();
  const handleNavigateClick = (cognitoId) => {
    setFollowersU(false);
    setfollowedEffect(!followedEffect);
    seteffectRun(!effectRun);
    settabValue("MyPosts");

    navigate(`/userprofile/${cognitoId}`);
  };

  const removeFollower = async (e) => {
    e.preventDefault();
    try {
      await axios.get(
        `${url}follow/unfollow?id=${aFollower._id}&followersId=${_id}`,
        requestInfo
      );

      seteffect(!effect);
      setuserDetailsEffect(!userDetailsEffect);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack
      flexDirection="row"
      alignSelf="flex-start"
      alignItems="center"
      justifyContent="flex-start"
      gap={2}
      width={1}
      padding={1}
    >
      <Stack flexDirection="row" alignItems="center" gap={2}>
        <Avatar
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
          sx={{ textDecoration: "none", color: "text.primary" }}
          marginRight={1}
          fontWeight={600}
        >
          {aFollower?.username}
        </Typography>
      </Stack>
      {checkId ? (
        <Button
          sx={{ marginLeft: "auto" }}
          color="error"
          onClick={(e) => {
            removeFollower(e, aFollower._id);
          }}
        >
          {" "}
          Remove
        </Button>
      ) : null}
    </Stack>
  );
}
