import { Box, Container, Pagination, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import Post from "./post";

export default function Feed({ called, setTag, tag, effectRunFromModal }) {
  const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [feedEffectRun, setfeedEffectRun] = useState(false);
  const [shouldEffectRun, setshouldEffectRun] = useState(false);
  const [loading, setloading] = useState(true);
  const [noPosts, setnoPosts] = useState(false);

  const theme = useTheme();
  const matchesDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const { user } = useAuthContext();
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const getAllPosts = async () => {
    try {
      setloading(true);
      const page = await axios.get(
        `${url}post/getPostPages`,
        requestInfo
      );
      setTotalPages(parseInt(page.data));

      const res = await axios.get(
        `${url}post/getAllPosts?page=${pageNumber}`,
        requestInfo
      );
      const data = res.data;

      let i = [];
      data.post.map((el) => i.push(el));

      setPosts(i);

      setloading(false);
      if (data.length === 0) {
        setnoPosts(true);
      } else {
        setnoPosts(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPostsByTag = async () => {
    try {
      setloading(true);
      if (tag.length === 1) {
        const page = await axios.get(
          `${url}post/getPagesForLocationSport?tags=${tag}`,
          requestInfo
        );
        setTotalPages(parseInt(page.data));
        const res = await axios.get(
          `${url}post/getPostByLocationOrSport?page=${pageNumber}&tags=${tag}`,
          requestInfo
        );
        const data = res.data;

        let i = [];
        data.map((el) => i.push(el));

        setPosts(i);
        if (data.length === 0) {
          setnoPosts(true);
        } else {
          setnoPosts(false);
        }
      } else if (tag.length > 1) {
        const page = await axios.get(
          `${url}post/getPagesForTags?tags=${tag}`,
          requestInfo
        );
        setTotalPages(parseInt(page.data));
        let str = tag.join();

        const res = await axios.get(
          `${url}post/getPostsByTag?page=${pageNumber}&tags=${str}`,
          requestInfo
        );
        const data = res.data;

        let i = [];
        data.map((el) => i.push(el));

        setPosts(i);
        if (data.length === 0) {
          setnoPosts(true);
        } else {
          setnoPosts(false);
        }
      } else {
        shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
      }
      setloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostsByTag();
  }, [tag, feedEffectRun, pageNumber, effectRunFromModal]);

  useEffect(() => {
    getAllPosts();
  }, [shouldEffectRun, effectRunFromModal, feedEffectRun]);

  return (
    <>
    <Stack flexDirection={matchesDesktop ? "row" : "column"}>
      {matchesDesktop ? (
        <Box flex={2} sx={{ display: { xs: "none", sm: "block" } }}></Box>
      ) : null}
      {loading ? (
        <Stack
          sx={{
            alignContent: "center",
            justifyContent: "center",
            height: "100vh",
            width: { xs: "100%", sm: "48%" },
            margin: { xs: 2, sm: 1 },
          }}
          spacing={1}
        >
          <Skeleton variant="text" height={100} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={300} />
          <Skeleton variant="text" height={100} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      ) : noPosts ? (
        <Stack
          height="70vh"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          {" "}
          <Typography> No Posts Yet</Typography>{" "}
        </Stack>
      ) : (
        <Box sx={{ flex: { xs: 1, sm: 4 } }}>
          {posts.map((el) => {
            return (
              <Post
                feedEffectRun={feedEffectRun}
                setfeedEffectRun={setfeedEffectRun}
                called="feed"
                post={el}
              />
            );
          })}
        </Box>
      )}

      {matchesDesktop ? (
        <Box flex={2} sx={{ display: { xs: "none", sm: "block" } }}></Box>
      ) : null}
    </Stack>

    <Box
      alignSelf="flex-end"
      py={{ xs: 2 }}
      bgcolor="text.secondary"
      color="white"
    >
      <Container maxWidth="lg">
        <Box textAlign="center">
          <Stack spacing={1} direction="row" justifyContent="center">
            <Pagination
              count={totalPages}
              onChange={(e, value) => setPageNumber(value)}
            />
          </Stack>
        </Box>
      </Container>
    </Box>
  </>
  );
}

