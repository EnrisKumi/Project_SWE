import React from "react";
import {
  Avatar,
  Modal,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  Tooltip,
  Typography,
  Popover,
  Skeleton,
} from "@mui/material";

import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";

import { useState, useEffect, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

import { DeleteOutline, MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import moment from "moment";

//TODO: Comment, ShowTags, JoinedUsersData

import peopleIcon from "../icons/Group 180.png";
import calendarIcon from "../icons/Group 179.png";
import commentIcon from "../icons/Group 175.png";
import chatIcon from "../icons/chat_2.png";
import { useApi } from "../hooks/api/useApi";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#118C94",
  fontSize: "10px",
  padding: "0px 0px ",
  height: "25px",
}));

export default function Post({
  post,
  called,
  seteffectRun,
  effectRun,
  feedEffectRun,
  setfeedEffectRun,
  userProfileFeedEffect,
  setuserProfileFeedEffect,
  settabValue,
}) {
  const { user } = useAuthContext();
  const { getUser } = useApi();
  const currentUserId = user.attributes.sub;
  //   const currentUserMongoId = getUser().then((res) => {
  //     console.log(res._id)
  //  })
  const {
    username,
    likes,
    text,
    tags,
    date,
    startTime,
    limit,
    postCognitoId,
    _id,
    joined,
    status,
  } = post;

  const [numberJoined, setnumberJoined] = useState(joined.length);
  const [commentsOpen, setcommentsOpen] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState([]);
  const [commentsText, setCommentsText] = useState("");
  const [shouldEffectRun, setshouldEffectRun] = useState(false);
  const [checked, setchecked] = useState(false);
  const [liked, setLiked] = useState();
  const [isJoined, setisJoined] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [postLoading, setpostLoading] = useState(true);
  const [postLikes, setpostLikes] = useState(likes.length);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setAnchorEl(false);
    }, 2000);
  };

  const onUsernameClick = () => {
    if (called === "userProfile") {
      settabValue("MyPosts");
      seteffectRun(!effectRun);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [userWhoPosted, setuserWhoPosted] = useState();

  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const postedFromNow = moment(date).fromNow();

  ///////////////////////////////////////////////////////////////
  // const getJoinedUsers = async () => {
  //     const userAuth = await Auth.currentAuthenticatedUser();
  //     const token = userAuth.signInUserSession.idToken.jwtToken;
  //     const requestInfo = {
  //       headers: {
  //         Authorization: token,
  //       },
  //     };
  //     const joinedU = await axios.get(
  //       `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/joined/users/${_id}`,
  //       requestInfo
  //     );

  //     return await joinedU.data;
  //   };

  //   const [joinedUsers, setJoinedUsers] = useState(false);
  ///////////////////////////////////////////////////////////////

  const clear = () => {
    setCommentsText("");
    setLiked("");
  };

  //   const joinPost = async () => {
  //     const userAuth = await Auth.currentAuthenticatedUser();
  //     const token = userAuth.signInUserSession.idToken.jwtToken;
  //     const requestInfo = {
  //       headers: {
  //         Authorization: token,
  //       },
  //     };
  //     await axios.get(
  //       `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/joinPost/${currentUserMongoId}/${_id}`,
  //       requestInfo
  //     );
  //     // shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
  //     // feedEffectRun ? setfeedEffectRun(false) : setfeedEffectRun(true);
  //   };

  // const unjoinPost = async () => {
  //     const userAuth = await Auth.currentAuthenticatedUser();
  //     const token = userAuth.signInUserSession.idToken.jwtToken;
  //     const requestInfo = {
  //       headers: {
  //         Authorization: token,
  //       },
  //     };
  //     await axios.get(
  //       `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/unjoinPost/${currentUserMongoId}/${_id}`,
  //       requestInfo
  //     );
  //     // feedEffectRun ? setfeedEffectRun(false) : setfeedEffectRun(true);
  //     // shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
  //   };

  // const deletePost = async (e, _id) => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       e.preventDefault();
  //       await axios.delete(
  //         `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/delete/post/${currentUserMongoId}/${_id}`,
  //         requestInfo
  //       );

  //       called === "userProfile"
  //         ? setuserProfileFeedEffect(!userProfileFeedEffect)
  //         : setfeedEffectRun(!feedEffectRun);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  // useEffect(() => {
  //     getUserFromCognitoId(postCognitoId).then((userWhoPostedData) =>
  //       setuserWhoPosted(userWhoPostedData)
  //     );
  //   }, []);

  //   useEffect(() => {
  //     allComments();
  //   }, [shouldEffectRun]);

  //   useEffect(() => {
  //     checkLike(currentUserMongoId, _id).then((bool) => {
  //       setchecked(bool);
  //       setpostLoading(false);
  //     });
  //     checkJoin(currentUserMongoId, _id).then((bool) => {
  //       setisJoined(bool);
  //     });
  //   }, [shouldEffectRun, currentUserMongoId, _id]);

  // const allComments = async () => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       const res = await axios.get(
  //         `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/comments/post/${_id}`,
  //         requestInfo
  //       );
  //       setComments(res.data);

  //       return res.data;
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  // const renderDeleteButton = (
  //     <>
  //       {postCognitoId === currentUserId ? (
  //         <IconButton
  //           onClick={(e) => deletePost(e, post._id)}
  //           aria-label="settings"
  //         >
  //           <DeleteOutline />
  //         </IconButton>
  //       ) : (
  //         <IconButton aria-label="settings">
  //           <MoreVert />
  //         </IconButton>
  //       )}
  //     </>
  //   );

  // const renderJoinButton = (
  //     <>
  //       {currentUserId == postCognitoId ? (
  //         <>
  //           <StyledButton
  //             onClick={(e) =>
  //               joined?.length > 0 ? setJoinedUsers(true) : handleClick(e)
  //             }
  //             sx={{
  //               fontSize: "10px",
  //             }}
  //             size="small"
  //             variant="contained"
  //           >
  //             Check{" "}
  //           </StyledButton>
  //           <Popover
  //             id={id}
  //             open={open}
  //             anchorEl={anchorEl}
  //             onClose={handleClose}
  //             anchorOrigin={{
  //               vertical: "bottom",
  //               horizontal: "left",
  //             }}
  //             transformOrigin={{
  //               vertical: "top",
  //               horizontal: "center",
  //             }}
  //           >
  //             <Typography sx={{ p: 2 }}>No one has joined yet</Typography>
  //           </Popover>
  //         </>
  //       ) : isJoined === true ? (
  //         <StyledButton
  //           onClick={() => {
  //             setisJoined(false);
  //             setnumberJoined((numberJoined) => numberJoined - 1);
  //             unjoinPost();
  //           }}
  //           size="small"
  //           variant="contained"
  //         >
  //           Leave
  //         </StyledButton>
  //       ) : numberJoined == limit ? (
  //         <StyledButton
  //           disabled
  //           sx={{ paddingX: 1 }}
  //           color="secondary"
  //           size="small"
  //           variant="contained"
  //         >
  //           Completed
  //         </StyledButton>
  //       ) : (
  //         <StyledButton
  //           onClick={() => {
  //             setisJoined(true);
  //             setnumberJoined((numberJoined) => numberJoined + 1);
  //             joinPost();
  //           }}
  //           size="small"
  //           variant="contained"
  //         >
  //           Join
  //         </StyledButton>
  //       )}
  //     </>
  //   );

  // const getLikes = async () => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       const res = await axios.get(
  //         ` https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/getLike/users/${_id}`,
  //         requestInfo
  //       );
  //       setpostLikes(res.data.length);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getLikes();
  //   }, [shouldEffectRun]);

  // const postComment = async () => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       await axios.post(
  //         `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/comment/post/${_id}`,
  //         {
  //           commentCognitoId: currentUserId,
  //           userName: userContext.loggedUser.username,
  //           text: commentsText,
  //           date: Date.now(),
  //         },
  //         requestInfo
  //       );
  //       shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
  //       clear();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   const removeLikeAtPost = async () => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       setpostLikes((postLikes) => postLikes - 1);
  //       await axios.get(
  //         `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/unLike/${currentUserMongoId}/${_id}`,
  //         requestInfo
  //       );
  //       // shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   const renderComments = comments.map((data) => {
  //     return <Comment data={data} />;
  //   });

  //   const addLikeAtPost = async () => {
  //     try {
  //       const userAuth = await Auth.currentAuthenticatedUser();
  //       const token = userAuth.signInUserSession.idToken.jwtToken;
  //       const requestInfo = {
  //         headers: {
  //           Authorization: token,
  //         },
  //       };
  //       setpostLikes((postLikes) => postLikes + 1);
  //       await axios.get(
  //         `https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com/dev/addLike/users/${currentUserMongoId}/${_id}`,
  //         requestInfo
  //       );

  //       // shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  return (
    <>
      {postLoading ? (
        <Skeleton variant="rectangular" height={300} sx={{ margin: 2 }} />
      ) : (
        <Card
          width="100%"
          sx={{
            marginX: { xs: 1, sm: called === "userProfile" ? 0 : 2 },
            marginY: 2,
          }}
        >
          <Stack flexdirection="row">
            <CardHeader
              sx={{ padding: "10px" }}
              title={
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500, textDecoration: "none" }}
                  color="text.primary"
                  component={Link}
                  to={`/userprofile/${postCognitoId}`}
                  onClick={() => onUsernameClick()}
                >
                  {username}
                </Typography>
              }
              avatar={
                <Avatar
                  src={userWhoPosted?.prfilePicture}
                  sx={{
                    bgcolor: `#B24D74`,
                    textDecoration: "none",
                    width: "40px",
                    height: "40px",
                  }}
                  aria-label="recipe"
                >
                  {username.substring(0, 1)}
                </Avatar>
              }
              subheader={postedFromNow}
            />
          </Stack>

          <CardContent sx={{ padding: "10px" }}>
            <Typography
              sx={{ fontSize: 16, wordBreak: "break-word" }}
              variant="body2"
              color="text.primary"
            >
              {text}
            </Typography>
          </CardContent>

          <Stack sx={{ padding: "10px", width: "100%" }}>
            <Stack flexDirection="row" alignItems="center">
              <img src={calendarIcon} height={20} width={20} alt="t"/>
              <Typography mx={1}>
                {" "}
                {startTime?.substring(0, 10) + " " + startTime?.slice(11, 21)}
              </Typography>
            </Stack>
            <Stack my="3px" flexDirection="row" alignItems="center">
              <img src={peopleIcon} height={20} width={20} alt="t"/>
              <Typography mx={1}>
                {" "}
                {numberJoined}/{limit}
              </Typography>
            </Stack>

            <Divider
              sx={{
                alignSelf: "center",
                width: 1,
                marginTop: 1,
                fontWeight: 200,
              }}
            />

            <Stack
              flexDirection="row"
              alignItems="center"
              sx={{ justifyContent: "space-between" }}
            >

              <Tooltip
                sx={{ marginRight: "auto" }}
                title=""
                onClick={() => {
                  setShowComment(!showComment);
                }}
              >
                <IconButton aria-label="add-comment">
                  <img src={commentIcon} height={20} width={20} alt="t"/>
                </IconButton>
              </Tooltip>
              {currentUserId === postCognitoId ? (
                <Button
                  startIcon={<img src={chatIcon} height={15} width={15} alt="t"/>}
                  color="primary"
                  sx={{
                    marginLeft: "auto",
                    marginRight: 1,
                    fontSize: "10px",
                    padding: "0px 0px ",
                    height: "25px",
                  }}
                  component={Link}
                  to={`/chat/${_id}`}
                  target={"_parent"}
                  size="small"
                  variant="outlined"
                >
                  Chat
                </Button>
              ) : null}
              {isJoined ? (
                <Button
                  startIcon={<img src={chatIcon} height={15} width={15} alt="t" />}
                  color="primary"
                  sx={{
                    marginLeft: "auto",
                    marginRight: 1,
                    fontSize: "10px",
                    padding: "0px 0px ",
                    height: "25px",
                  }}
                  to={`/chat/${_id}`}
                  component={Link}
                  target={"_parent"}
                  size="small"
                  variant="outlined"
                >
                  Chat
                </Button>
              ) : null}
            </Stack>

            <Stack flexDirection="row">
              <Typography paddingRight="4px" paddingLeft="2px">
                {postLikes}
              </Typography>
              <Typography>{postLikes == 1 ? "Like" : "Likes"} </Typography>
            </Stack>
            <Stack flexDirection="row">
              <Button
                variant="text"
                disableRipple
                onClick={() =>
                  comments.length > 0
                    ? setcommentsOpen(!commentsOpen)
                    : setcommentsOpen(commentsOpen)
                }
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                  padding: "2px",
                  margin: 0,
                  minHeight: 0,
                  minWidth: 0,
                }}
              >
                {!commentsOpen
                  ? comments.length > 0
                    ? `View all ${comments?.length} comments`
                    : "No Comments"
                  : "Hide Comments"}
              </Button>
            </Stack>
            <Stack>
              {showComment ? (
                <>
                  {/* <IconButton
              onClick={() => {
                postComment();
              }}
            >
              <AddIcon />
            </IconButton> */}
                </>
              ) : null}
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}
