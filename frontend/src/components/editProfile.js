import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getCurrentUserId, updateUserInfo } from "../apiCalls";
import xIcon from "../icons/Group 182.png";
import FileBase from "react-file-base64";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useApi } from "../hooks/api/useApi";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function EditProfile({
  called,
  setOpen,
  userDetailsEffect,
  setuserDetailsEffect,
}) {
  const [newLocation, setnewLocation] = useState("");
  const [newBio, setnewBio] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState("");
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const bio = currentUser?.data.bio
  const location = currentUser?.data.location
  const prfilePicture = currentUser.data.prfilePicture
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  ///////////////////////////////////////////////////////////////
  const updateUserInfo = async (
    mongoId,
    newBio,
    newLocation,
    newProfilePicture,
    setuserDetailsEffect,
    userDetailsEffect,
    called
  ) => {
    let body = {};
    if (newBio) {
      body.bio = newBio;
    }
    if (newLocation) {
      body.location = newLocation;
    }
    if (newProfilePicture) {
      body.prfilePicture = newProfilePicture;
    }
    await axios.patch(`${url}user/updateUser?id=${mongoId}`, body, requestInfo);
    if (called === "userdetails") {
      setuserDetailsEffect(!userDetailsEffect);
    }
  };
  ///////////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const handleNavigateClick = () => {
    navigate(`/userprofile/${cognitoId}`);
  };

  const handleSave =async (e) => {
    try {
      e.preventDefault();
      await updateUserInfo(
        mongoId,
        newBio,
        newLocation,
        newProfilePicture,
        setuserDetailsEffect,
        userDetailsEffect,
        called
      );
      handleNavigateClick();
      if (called === "userdetails") {
        setOpen(false);
      }
     
      handleReload();
    } catch (error) {
      console.log(error);
    }
  };



  const handleReload = () => {
    window.location.reload();
  };




  return (
    <Stack
      color="text.primary"
      borderRadius={5}
      p={3}
      sx={{ backgroundColor: "background.myBackground", paddingTop: 2 }}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          onClick={
            called === "userdetails"
              ? () => setOpen(false)
              : () => handleNavigateClick()
          }
        >
          <img src={xIcon} height={20} width={20} alt="missing" />
        </IconButton>

        <Typography
          sx={{ marginRight: "10%" }}
          fontSize="16px"
          color="gray"
          textAlign="center"
        >
          Edit Profile
        </Typography>
        <Box></Box>
      </Stack>
      <Divider
        sx={{
          alignSelf: "center",
          width: 1,
          marginY: 1,
          fontWeight: 200,
        }}
      />
      <Stack gap={2} my={1} alignItems="center">
        <Avatar sx={{ width: 90, height: 90 }} src={prfilePicture} />

        <Typography
          fontWeight={500}
          color="primary"
          fontSize="16px"
          variant="span"
          alignSelf="center !important"
        >
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) => setNewProfilePicture(base64)}
          />
        </Typography>
      </Stack>
      <TextField
        id="outlined-number"
        sx={{ marginY: 2 }}
        size="small"
        placeholder={bio}
        onChange={(e) => setnewBio(e.target.value)}
        value={newBio}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography fontSize={14} sx={{ color: "text.secondary" }}>
                {" "}
                BIO
              </Typography>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <TextField
        id="outlined-number"
        size="small"
        value={newLocation}
        placeholder={location}
        onChange={(e) => setnewLocation(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography fontSize={14} sx={{ color: "text.secondary" }}>
                {" "}
                Location
              </Typography>
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <Button
        variant="contained"
        onClick={(e) => {
          handleSave(e);
        }}
        size="large"
        color="primary"
        sx={{ width: "100%", marginY: 3 }}
      >
        Save
      </Button>
    </Stack>
  );
}
