import { Avatar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";
const style = {
  position: "relative",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default function UserSearchModal({ usersFound, loading }) {
  return (
    <>
      <Stack
        sx={{
          width: 1,
          height: 300,
          backgroundColor: "white",

          padding: 2,
          overflow: "hidden",
          overflowY: "scroll",
        }}
        alignItems="flex-start"
      >
        {loading ? (
          <div style={style}>
            <MoonLoader color="grey" loading speedMultiplier={1} />
          </div>
        ) : (
          <>
            <Typography
              sx={{ marginRight: "10%" }}
              fontSize="16px"
              color="gray"
              textAlign="center"
            >
              Results
            </Typography>
            {usersFound?.length > 0 ? (
              usersFound?.map((aUser) => (
                <Stack
                  flexDirection="row"
                  alignSelf="flex-start"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap={2}
                  padding={1}
                  sx={{ textDecoration: "none" }}
                  component={Link}
                  to={`/userprofile/${aUser.userCognitoId}`}
                >
                  <Avatar
                    src={aUser.prfilePicture}
                    sx={{
                      bgcolor: `red`,
                      textDecoration: "none",
                      width: "30px",
                      height: "30px",
                      marginRight: "auto",
                    }}
                    aria-label="recipe"
                  >
                    {aUser?.username.substring(0, 1)}
                  </Avatar>

                  <Typography
                    sx={{ textDecoration: "none", color: "text.primary" }}
                    marginRight={1}
                    fontWeight={600}
                  >
                    {aUser?.username}
                  </Typography>
                </Stack>
              ))
            ) : (
              <Stack
                sx={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>No Users Found</Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </>
  );
}

