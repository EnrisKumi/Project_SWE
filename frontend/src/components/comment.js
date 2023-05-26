import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment/moment";
import React from "react";
import { Link } from "react-router-dom";

export default function Comment({data}) {

  const commentedFromNow = moment(data.date).fromNow();

  return (
    <>
      <Stack padding="5px" marginBottom={1}>
        <Stack flexDirection="row">
          <Typography
            component={Link}
            to={`/userprofile/${data.commentCognitoId}`}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start',
                  fontSize: 16, textDecoration: "none" }}
                  fontWeight={600}
          >
            {data?.userName}
          </Typography>

          <Typography
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start',
                  fontSize: 12,marginTop:"2px",px:"7px"}}
                  fontWeight={300}
                >
                  {commentedFromNow}
                </Typography>
        </Stack>
        <Stack flexDirection="row" alignItems="center">
          <Typography
            sx={{ width: 1, wordBreak: "break-all" ,display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}
            fontWeight={500}
          >
            {data?.text}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
