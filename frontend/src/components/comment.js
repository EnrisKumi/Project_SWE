import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment/moment";
import React from "react";
import { Link } from "react-router-dom";

export default function Comment({data}) {

  const commentedFromNow = moment(data.date).fromNow();

  return (
    <>
      <Stack paddingLeft="2px" marginBottom={1}>
        <Stack flexDirection="row">
          <Typography
            component={Link}
            to={`/userprofile/${data.commentCognitoId}`}
            sx={{
              textDecoration: "none",
              color: "text.primary",
            }}
            marginRight={1}
            fontWeight={600}
          >
            {data?.userName}{" "}
          </Typography>
          <Typography
            sx={{ marginLeft: "auto", fontSize: 12 }}
            fontWeight={100}
          >
            {commentedFromNow}{" "}
          </Typography>
        </Stack>
        <Stack flexDirection="row" marginTop="0px" alignItems="center">
          <Typography
            sx={{ width: 1, wordBreak: "break-all" }}
            fontWeight={100}
          >
            {data?.text}{" "}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
