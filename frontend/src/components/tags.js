import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import { Autocomplete, Box, Stack, TextField } from "@mui/material";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function Tags({ called, setTag, tag }) {
  const [tags, setTags] = useState([]);

  const { user } = useAuthContext();
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const getTags = async () => {
    const res = await axios.get(
      `${url}location/getLocations`,
      requestInfo
    );
    const data = res.data;

    let i = [];
    data.map((el) =>
      i.push({ title: el.text, _id: el._id, category: "Location" })
    );

    const response = await axios.get(
      `${url}sport/getSports`,
      requestInfo
    );
    const sportTags = response.data;
    sportTags.map((el) =>
      i.push({ title: el.text, _id: el._id, category: "Sport" })
    );

    setTags(i);
  };

  useEffect(() => {
    getTags();
  }, []);
  return (
    <Stack flexDirection="row" marginTop={called === "main" ? 2 : 0}>
    <Box
      flex={2}
      sx={{
        display: called === "modal" ? "none" : { xs: "none", sm: "block" },
      }}
    ></Box>
    <Box
      flex={4}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Autocomplete
        id="grouped-demo"
        options={tags}
        size="small"
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(event, value) => {
          let tagsArray = [];
          value.map((el) => {
            tagsArray.push(el._id);
          });
          setTag(tagsArray);
        }}
        multiple
        limitTags={2}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose Tags"
            placeholder="Location/Sport"
          />
        )}
        sx={{
          width: called === "modal" ? "100%" : { xs: "92%", sm: "95%" },
          backgroundColor: "background.paper",
        }}
      />
    </Box>
    <Box
      flex={2}
      sx={{
        display: called === "modal" ? "none" : { xs: "none", sm: "block" },
      }}
    ></Box>
  </Stack>
);
}
