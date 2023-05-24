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
import React from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { DeleteOutline, MoreVert } from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import peopleIcon from "../icons/Group 180.png";
import calendarIcon from "../icons/Group 179.png";
import commentIcon from "../icons/Group 175.png";
import chatIcon from "../icons/chat_2.png";
import moment from "moment";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import ShowTags from "./showTags";
import Comment from "./comment";
import JoinedUsersData from "./joinedUsersData";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

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
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

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
  const getJoinedUsers = async () => {
    const joinedU = await axios.get(
      `${url}join/getJoinedUsers?id=${_id}`,
      requestInfo
    );
    return await joinedU.data;
  };

  const [joinedUsers, setJoinedUsers] = useState(false);
  ///////////////////////////////////////////////////////////////

  const clear = () => {
    setCommentsText("");
    setLiked("");
  };

  ///////////////////////////////////////////////////////////////
  const joinPost = async () => {
    await axios.get(
      `${url}join/joinPost?userId=${mongoId}&postId=${_id}`,
      requestInfo
    );
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const unjoinPost = async () => {
    await axios.get(
      `${url}join/joinPost?userId=${mongoId}&postId=${_id}`,
      requestInfo
    );
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const deletePost = async (e, _id) => {
    try {
      e.preventDefault();
      await axios.delete(
        `${url}post/deletePostByUserId?userId=${mongoId}&postId=${_id}`,
        requestInfo
      );

      called === "userProfile"
        ? setuserProfileFeedEffect(!userProfileFeedEffect)
        : setfeedEffectRun(!feedEffectRun);
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const checkLike = async (currentUserMongoId, postId) => {
    const res = await axios.get(
      `${url}like/checkIfLiked?id=${currentUserMongoId}&postId=${postId}`,
      requestInfo
    );

    return await res.data;
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const checkJoin = async (currentUserMongoId, postId) => {
    const res = await axios.get(
      `${url}join/checkJoinedPost?id=${currentUserMongoId}&postId=${postId}`,
      requestInfo
    );

    return await res.data;
  };
  ///////////////////////////////////////////////////////////////

  useEffect(() => {
    allComments();
  }, [shouldEffectRun]);

  useEffect(() => {
    checkLike(mongoId, _id).then((bool) => {
      setchecked(bool);
      setpostLoading(false);
    });
    checkJoin(mongoId, _id).then((bool) => {
      setisJoined(bool);
    });
  }, [shouldEffectRun, mongoId, _id]);

  ///////////////////////////////////////////////////////////////
  const allComments = async () => {
    try {
      const res = await axios.get(
        `${url}comment/getCommentAtPost?id=${_id}`,
        requestInfo
      );

      setComments(res.data);

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////

  const renderDeleteButton = (
    <>
      {postCognitoId === cognitoId ? (
        <IconButton
          onClick={(e) => deletePost(e, post._id)}
          aria-label="settings"
        >
          <DeleteOutline />
        </IconButton>
      ) : (
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      )}
    </>
  );

  const renderJoinButton = (
    <>
      {postCognitoId === cognitoId ? (
        <>
          <StyledButton
            onClick={(e) =>
              joined?.length > 0 ? setJoinedUsers(true) : handleClick(e)
            }
            sx={{
              fontSize: "10px",
            }}
            size="small"
            variant="contained"
          >
            Check{" "}
          </StyledButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Typography sx={{ p: 2 }}>No one has joined yet</Typography>
          </Popover>
        </>
      ) : isJoined === true ? (
        <StyledButton
          onClick={() => {
            setisJoined(false);
            setnumberJoined((numberJoined) => numberJoined - 1);
            unjoinPost();
          }}
          size="small"
          variant="contained"
        >
          Leave
        </StyledButton>
      ) : numberJoined === limit ? (
        <StyledButton
          disabled
          sx={{ paddingX: 1 }}
          color="secondary"
          size="small"
          variant="contained"
        >
          Completed
        </StyledButton>
      ) : (
        <StyledButton
          onClick={() => {
            setisJoined(true);
            setnumberJoined((numberJoined) => numberJoined + 1);
            joinPost();
          }}
          size="small"
          variant="contained"
        >
          Join
        </StyledButton>
      )}
    </>
  );
  ////////////////////////////////////////////////////////////
  const getLikes = async () => {
    try {
      const res = await axios.get(`${url}like/getLikes?id=${_id}`, requestInfo);
      setpostLikes(res.data.length);
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////

  useEffect(() => {
    getLikes();
  }, [shouldEffectRun]);

  ///////////////////////////////////////////////////////////////
  const postComment = async () => {
    try {
      await axios.post(
        `${url}comment/postCommentAtPost?id=${_id}`,
        {
          commentCognitoId: cognitoId,
          userName: user.username,
          text: commentsText,
          date: Date.now(),
        },
        requestInfo
      );
      shouldEffectRun ? setshouldEffectRun(false) : setshouldEffectRun(true);
      clear();
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////

  const renderComments = comments.map((data) => {
    return <Comment data={data} />;
  });

  ///////////////////////////////////////////////////////////////
  const addLikeAtPost = async () => {
    try {
      setpostLikes((postLikes) => postLikes + 1);
      await axios.get(
        `${url}like/addLike?userId=${mongoId}&postId=${_id}`,
        requestInfo
      );
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  const removeLikeAtPost = async () => {
    try {
      setpostLikes((postLikes) => postLikes - 1);
      await axios.get(
        `${url}like/removeLike?userId=${mongoId}&postId=${_id}`,
        requestInfo
      );
    } catch (error) {
      console.log(error);
    }
  };
  ///////////////////////////////////////////////////////////////

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
              action={
                <Stack flexDirection="row" alignItems="center">
                  {status === "Completed" ? (
                    <StyledButton
                      disabled
                      sx={{ paddingX: 1 }}
                      color="secondary"
                      size="small"
                      variant="contained"
                    >
                      Event Finished
                    </StyledButton>
                  ) : (
                    renderJoinButton
                  )}

                  {renderDeleteButton}
                </Stack>
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
              <img src={calendarIcon} height={20} width={20} alt="e" />
              <Typography mx={1}>
                {" "}
                {startTime?.substring(0, 10) + " " + startTime?.slice(11, 21)}
              </Typography>
            </Stack>
            <Stack my="3px" flexDirection="row" alignItems="center">
              <img src={peopleIcon} height={20} width={20} alt="2" />
              <Typography mx={1}>
                {" "}
                {numberJoined}/{limit}
              </Typography>
            </Stack>
            <Stack flexDirection="row" alignItems="center">
              {tags?.map((el) => (
                <ShowTags tags={el} />
              ))}
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
              <Tooltip title="">
                <Checkbox
                  sx={{ width: 20, height: 20 }}
                  checked={checked}
                  onClick={
                    checked ? () => setchecked(false) : () => setchecked(true)
                  }
                  onChange={
                    checked
                      ? () => {
                          removeLikeAtPost();
                        }
                      : () => {
                          addLikeAtPost();
                        }
                  }
                  icon={<FavoriteBorder sx={{ width: 20, height: 20 }} />}
                  checkedIcon={
                    <Favorite sx={{ color: "red", width: 20, height: 20 }} />
                  }
                />
              </Tooltip>

              <Tooltip
                sx={{ marginRight: "auto" }}
                title=""
                onClick={() => {
                  setShowComment(!showComment);
                }}
              >
                <IconButton aria-label="add-comment">
                  <img src={commentIcon} height={20} width={20} />
                </IconButton>
              </Tooltip>
              {cognitoId === postCognitoId ? (
                <Button
                  startIcon={<img src={chatIcon} height={15} width={15} />}
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
                  startIcon={<img src={chatIcon} height={15} width={15} />}
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
              <Typography>{postLikes === 1 ? "Like" : "Likes"} </Typography>
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
                  <FormControl
                    onSubmit={() => {
                      postComment();
                      setcommentsOpen(!commentsOpen);
                      setShowComment(!showComment);
                    }}
                  >
                    <OutlinedInput
                      size="small"
                      id="outlined-adornment-weight"
                      placeholder="Type your comment"
                      value={commentsText}
                      endAdornment={
                        <InputAdornment position="end">
                          <StyledButton
                            type="submit"
                            onSubmit={() => {
                              postComment();
                              setcommentsOpen(!commentsOpen);
                              setShowComment(!showComment);
                            }}
                            onClick={() => {
                              postComment();
                              setcommentsOpen(!commentsOpen);
                              setShowComment(!showComment);
                            }}
                            sx={{ color: "white" }}
                          >
                            Done
                          </StyledButton>
                        </InputAdornment>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      onChange={(e) => setCommentsText(e.target.value)}
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    />
                  </FormControl>
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
            {commentsOpen ? renderComments : null}
            <Modal
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              open={joinedUsers}
              onClose={() => setJoinedUsers(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <JoinedUsersData
                effectRun={effectRun}
                seteffectRun={seteffectRun}
                setJoinedUsers={setJoinedUsers}
                _id={_id}
                getJoinedUsers={getJoinedUsers}
              />
            </Modal>
          </Stack>
        </Card>
      )}
    </>
  );
}
