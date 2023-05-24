import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Popover,
  styled,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import axios from "axios";
import xIcon from "../icons/Group 182.png";
import peopleIcon from "../icons/Group 180.png";
import calendarIcon from "../icons/Group 179.png";
import { Link, useNavigate } from "react-router-dom";
import Tags from "./tags";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

export default function NewPostModalNewPage({
  calledd,
  setOpen,
  called,
  seteffectRunFromModal,
  effectRunFromModal,
}) {
  const [value, setValue] = useState(dayjs());
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [text, setText] = useState("");
  const [limit, setLimit] = useState("");
  const [isposting, setisposting] = useState(false);
  const [tag, setTag] = useState();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user, currentUser } = useAuthContext()
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setAnchorEl(false);
    }, 2000);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const handleNavigateClick = () => {
    navigate("/mainPage");
  };

  const clear = () => {
    setLimit("");
    setText("");
    setTag([]);
  };

  const postPost = async (e) => {
    try {
      setisposting(true);
      e.preventDefault();
      await axios.post(
        `${url}post/createPostAtUser?id=${mongoId}`,
        {
          postCognitoId: cognitoId,
          text: text,
          limit: limit,
          date: Date.now(),
          startTime: value.$d,
          username: user.username,
          tags: tag,
        },
        requestInfo
      );
      if (calledd !== "UserProfile") {
        handleNavigateClick();
      }
      clear();
      setisposting(false);
      setOpen(false);
      seteffectRunFromModal(!effectRunFromModal);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, [mongoId, cognitoId]);

  return (
    <>
      <Stack
        bgcolor="background.default"
        color="text.primary"
        borderRadius={5}
        p={3}
        sx={{ paddingTop: 2, width: called === "NewPostModal" ? "500px" : 1 }}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            onClick={() => setOpen(false)}
            component={Link}
            to="/mainPage"
          >
            <img src={xIcon} height={20} width={20} alt="missing"/>
          </IconButton>

          <Typography
            sx={{ marginRight: "10%" }}
            fontSize="16px"
            color="gray"
            textAlign="center"
          >
            Create Post
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
        <Stack flexDirection="row" gap={2} my={1} alignItems="center">
          <Avatar
            sx={{ width: 40, height: 40 }}
            alt="photo"
            src={mongoId?.prfilePicture}
          />
          <Typography fontWeight={500} fontSize="16px" variant="span">
            {user.username}
          </Typography>
        </Stack>
        <UserBox></UserBox>
        <TextField
          id="standard-multiline-static"
          sx={{
            width: "100%",
          }}
          multiline
          placeholder="What's on yo mind, huh?"
          rows={3}
          variant="standard"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Typography mb={1} mt={3}>
          Post Details
        </Typography>

        <TextField
          id="outlined-number"
          size="small"
          type="number"
          value={limit}
          onChange={(e) =>
            setLimit(
              e.target.value < 0
                ? (e.target.value = 0)
                : e.target.value === isNaN()
                ? (e.target.value = 0)
                : e.target.value
            )
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img src={peopleIcon} height={20} width={20} alt="missing"/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Typography fontSize={14} sx={{ color: "text.secondary" }}>
                  {" "}
                  People limit
                </Typography>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <Box my={1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={calendarIcon} height={20} width={20} alt="missing"/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography fontSize={14} sx={{ color: "text.secondary" }}>
                      {" Date & time "}
                    </Typography>
                  </InputAdornment>
                ),
              }}
              renderInput={(props) => (
                <TextField sx={{ width: 1 }} size="small" {...props} />
              )}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
            />
          </LocalizationProvider>
        </Box>
        <Typography mb={1} mt={1}>
          Tags
        </Typography>

        <Tags called="modal" tag={tag} setTag={setTag} />

        <Button
          variant="contained"
          size="large"
          color="primary"
          sx={{ width: "100%", marginY: 3 }}
          flex={1}
          onClick={(e) => {
            if (text && limit && value && tag) {
              postPost(e);
            } else {
              handleClick(e);
            }
          }}
        >
          {isposting ? "Posting ..." : "Post"}
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography sx={{ p: 2 }}>
            Please fill all of the inputs above
          </Typography>
        </Popover>
      </Stack>
    </>
  );
}
