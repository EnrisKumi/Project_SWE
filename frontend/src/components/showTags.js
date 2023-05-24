import React, { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import axios from "axios";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function ShowTags({tags}) {
  const [locationTag, setlocationTag] = useState();
  const [sportTag, setsportTag] = useState();

  const { user } = useAuthContext();
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const getLocationTag = async () => {
    const res = await axios.get(
      `${url}location/getLocations/${tags}`, requestInfo);
    setlocationTag(res.data);
  };

  const getSportTag = async () => {
    const res = await axios.get(`${url}sport/getSports/${tags}`, requestInfo);
    setsportTag(res.data);
  };

  useEffect(() => {
    getLocationTag();
    getSportTag();
  }, [tags]);

  return (
    <>
      <Chip
        sx={{ fontSize: "12px", height: 25, marginRight: "5px", my: "3px" }}
        label={locationTag ? locationTag?.text : sportTag?.text}
      />
    </>
  );
}
