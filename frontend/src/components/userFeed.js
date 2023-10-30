import { Skeleton, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import Post from "./post";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function Feed({
  cognitoId,
  seteffectRun,
  effectRun,
  tabValue,
  settabValue,
  setnoPosts,
  noPosts,
}) {
  //   const userContext = useContext(UserContext);

  const { user, currentUser } = useAuthContext();
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };
  const [userProfileFeedEffect, setuserProfileFeedEffect] = useState(false);
  const [loading, setloading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);

  const getUserFromDatabase = async(cognitoId) => {
    const res = await axios.get(`${url}user/getCognitoUserById?cognitoId=${cognitoId}`,
    requestInfo)
    return res.data._id
  }

  const getUserPosts = async (mongoId) => {
    setloading(true);
    const endpoint =
      tabValue === "MyPosts"
        ? `${url}post/getPostsByUserId?id=${mongoId}`
        : `${url}post/getPostJoined?id=${mongoId}`;
    try {
      const res = await axios.get(endpoint, requestInfo);
      const data = res.data;

      if(tabValue === "MyPosts"){
      setUserPosts(data.reverse());
      }else{
        setUserPosts(data);
      }
      setloading(false);
      if (data.length === 0) {
        setnoPosts(true);
      } else {
        setnoPosts(false);
      }
    } catch (error) {}
  };
  const renderPosts = userPosts
    .slice(0)
    .map((el) => {
      return (
        <Post
          settabValue={settabValue}
          userProfileFeedEffect={userProfileFeedEffect}
          setuserProfileFeedEffect={setuserProfileFeedEffect}
          seteffectRun={seteffectRun}
          effectRun={effectRun}
          called="userProfile"
          post={el}
        />
      );
    });

  useEffect(() => {
    getUserFromDatabase(cognitoId).then((id) => getUserPosts(id));
  }, [effectRun, userProfileFeedEffect, tabValue]);

  return (
    <Stack flex={8} marginBottom={userPosts?.length > 3 ? 12 : 0}>
      {loading ? (
        <Stack
          sx={{ height: "100vh" }}
          my={1}
          marginX={1}
          padding={1}
          spacing={1}
        >
          <Skeleton variant="rectangular" height={300} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      ) : noPosts ? (
        <Stack
          height="50vh"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {" "}
          <Typography>
            {" "}
            {tabValue === "MyPosts"
              ? "No Posts Yet"
              : "You haven't joined any events yet"}
          </Typography>
        </Stack>
      ) : (
        renderPosts
      )}
    </Stack>
  );
}
