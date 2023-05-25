import {
  Avatar,
  Button,
  Modal,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

// import {
//   checkFollow,
//   getCurrentUserId,
//   getMongoIdFromCognitoId,
// } from "../apiCalls";

////////////////////////
import FollowedData from "./followedData";
import FollowersData from "./followersData";
import EditProfile from "./editProfile";
///////////////////////

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/auth/useAuthContext";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function UserDetails({
  userId,
  bio,
  location,
  effectRun,
  seteffectRun,
  setdividerLoading,
  settabValue,
  tabValue,
  prfilePicture,
  followed,
  followers,
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { user, currentUser } = useAuthContext();
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };
  const navigate = useNavigate();
  const handleNavigateClick = () => {
    navigate(`/editprofile`);
  };
  const [isFollowed, setisFollowed] = useState();
  const [followState, setfollowState] = useState(isFollowed);
  const [bioUpdate, setbioUpdate] = useState("");
  const [locationUpdate, setlocationUpdate] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFollowedUModalClose = () => setFollowedU(false);
  const handleFollowersUModalClose = () => setFollowersU(false);
  const checkId = userId === mongoId;
  const [runEffect, setrunEffect] = useState(false);
  const [loading, setloading] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersU, setFollowersU] = useState(false);
  const [followedU, setFollowedU] = useState(false);
  const [userDetailsEffect, setuserDetailsEffect] = useState(false);
  const [followedEffect, setfollowedEffect] = useState(false);

  const follow = async (e, currentUserMongoId, userMongoId) => {
    e.preventDefault();
    const idk = await axios.get(
      `${url}follow/followUser?id=${currentUserMongoId}&followersId=${userMongoId}`,
      requestInfo
    );
    if (runEffect) {
      setrunEffect(false);
    } else {
      setrunEffect(true);
    }
  };
  //////////////////////////////////

  //////////////////////////////////
  const unfollow = async (e, currentUserMongoId, userMongoId) => {
    e.preventDefault();
    const idk = await axios.get(
      `${url}follow/unfollow?id=${currentUserMongoId}&followersId=${userMongoId}`,
      requestInfo
    );
    if (runEffect) {
      setrunEffect(false);
    } else {
      setrunEffect(true);
    }
  };
  //////////////////////////////////

  //////////////////////////////////
  const checkFollow = async (currentUserMongoId, userMongoId) => {
    const res = await axios.get(
      `${url}follow/checkIfFollows?id=${currentUserMongoId}&followersId=${userMongoId}`,
      requestInfo
    );
    return await res.data;
  };
  //////////////////////////////////

  const renderFollowButton = (
    <>
      {checkId === false && isFollowed === false ? (
        <Button
          size="medium"
          sx={{
            width: { xs: 0.97, sm: 1 },
          }}
          variant="contained"
          onClick={(e) => {
            follow(e, mongoId, userId);
          }}
        >
          Follow
        </Button>
      ) : checkId === false && isFollowed === true ? (
        <Button
          size="medium"
          sx={{
            width: { xs: 0.97, sm: 1 },
          }}
          variant="contained"
          onClick={(e) => {
            unfollow(e, userId, mongoId);
          }}
        >
          Unfollow
        </Button>
      ) : null}
    </>
  );
  // useEffect(() => {
  //   setdividerLoading(false)
  // }, [open, isFollowed, effectRun, userDetailsEffect, followedEffect]);

  useEffect(() => {
    setdividerLoading(false);
  }, [open, isFollowed, effectRun, userDetailsEffect, followedEffect]);

  useEffect(() => {
    checkFollow(userId, mongoId).then((bool) => setisFollowed(bool));
  }, [isFollowed, mongoId, userId, runEffect]);

  return (
    <>
      <Stack
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        sx={{ backgroundColor: "", marginX: { xs: 1, sm: 0 } }}
      >
        <Stack flex={2}>
          {loading ? (
            <Skeleton
              variant="circular"
              sx={{
                width: { xs: "75px", sm: "150px" },
                height: { xs: "75px", sm: "150px" },
              }}
            />
          ) : (
            <Avatar
              alt="Remy Sharp"
              src={prfilePicture}
              sx={{
                width: { xs: "75px", sm: "125px" },
                height: { xs: "75px", sm: "125px" },
              }}
            />
          )}
        </Stack>
        <Stack flex={1}></Stack>

        <Stack flex={4} flexDirection="row">
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ width: "100%" }}
              height={60}
            />
          ) : (
            <>
              <Button
                sx={{ color: "text.primary" }}
                onClick={() =>
                  followers?.length > 0
                    ? setFollowersU(true)
                    : setFollowersU(false)
                }
              >
                <Stack flex={1} flexDirection="column" alignItems="center">
                  {" "}
                  {/*ky esh stacku Followers*/}
                  <Typography
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      padding: 0,
                    }}
                    variant="p"
                    component="span"
                    fontWeight={100}
                  >
                    {followers?.length}
                  </Typography>
                  <Typography
                    sx={{
                      padding: 0,
                    }}
                    variant="p"
                    component="span"
                    fontWeight={100}
                  >
                    {followers?.length === 1 ? `Follower` : ` Followers `}
                  </Typography>
                </Stack>
              </Button>
              <Stack flex={1}></Stack>

              <Button
                sx={{ color: "text.primary" }}
                onClick={() =>
                  followed?.length > 0
                    ? setFollowedU(true)
                    : setFollowedU(false)
                }
              >
                <Stack flex={1} flexDirection="column" alignItems="center">
                  {" "}
                  <Typography
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      padding: 0,
                    }}
                    variant="p"
                    component="span"
                    fontWeight={100}
                  >
                    {followed?.length}
                  </Typography>
                  <Typography
                    sx={{
                      padding: 0,
                    }}
                    variant="p"
                    component="span"
                    fontWeight={100}
                  >
                    {followers?.length === 1 ? `  Following` : `  Following `}
                  </Typography>
                </Stack>
              </Button>
            </>
          )}
        </Stack>

        <Stack flex={1}></Stack>
      </Stack>
      <Stack flex={4} flexDirection="column">
        <Stack
          flexDirection="row"
          sx={{ backgroundColor: "", paddingY: { xs: 1, sm: 1 } }}
        >
          {loading ? (
            <Skeleton
              my={1}
              animation="wave"
              sx={{ marginLeft: "8px" }}
              height={10}
              width="20%"
            />
          ) : (
            <Typography
              sx={{
                alignSelf: { xs: "flex-start", sm: "flex-start" },
                fontWeight: { xs: 100, sm: 100 },
                fontSize: { sm: "16px" },
              }}
              variant="p"
              component="span"
            >
              Bio: {bio}
            </Typography>
          )}
        </Stack>
        <Stack
          justifyContent="space-around"
          sx={{
            backgroundColor: "",
            paddingY: 0,
            paddingX: { xs: 1, sm: 0 },
            fontSize: "12px",
            flexDirection: { xs: "column", sm: "column" },
          }}
        >
          {loading ? (
            <Skeleton
              my={1}
              animation="wave"
              height={10}
              width="20%"
              sx={{
                alignSelf: { xs: "flex-start", sm: "flex-start" },
              }}
            />
          ) : (
            <Typography
              sx={{
                alignSelf: { xs: "flex-start", sm: "flex-start" },
                fontWeight: { xs: 100, sm: 100 },
                fontSize: { sm: "16px" },
              }}
              variant="p"
              component="span"
              fontWeight={100}
            >
              Location: {location}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Stack flexDirection="row" justifyContent="center" marginTop={1}>
        {checkId === true ? (
          loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ width: "95%", my: 1 }}
              height={25}
            />
          ) : (
            <Button
              size="small"
              onClick={
                matches ? () => setOpen(true) : () => handleNavigateClick()
              }
              sx={{
                color: "text.primary",
                borderColor: "text.primary",
                width: { xs: 0.97, sm: 1 },
              }}
              variant="outlined"
            >
              Edit Profile
            </Button>
          )
        ) : loading ? (
          <Skeleton
            variant="rectangular"
            sx={{ width: "95%", my: 1 }}
            height={25}
          />
        ) : (
          renderFollowButton
        )}{" "}
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={followersU}
          onClose={handleFollowersUModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FollowersData
            followedEffect={followedEffect}
            setfollowedEffect={setfollowedEffect}
            seteffectRun={seteffectRun}
            effectRun={effectRun}
            userDetailsEffect={userDetailsEffect}
            setuserDetailsEffect={setuserDetailsEffect}
            checkId={checkId}
            setFollowersU={setFollowersU}
            userId={checkId ? userId : mongoId}
            settabValue={settabValue}
            tabValue={tabValue}
          />
        </Modal>
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={followedU}
          onClose={handleFollowedUModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <FollowedData
            settabValue={settabValue}
            tabValue={tabValue}
            followedEffect={followedEffect}
            setfollowedEffect={setfollowedEffect}
            seteffectRun={seteffectRun}
            effectRun={effectRun}
            setFollowedU={setFollowedU}
            userId={checkId ? mongoId : userId}
          />
        </Modal>
        <Modal
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          open={open} ///////////// ----> Fix
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <EditProfile
            userDetailsEffect={userDetailsEffect}
            setuserDetailsEffect={setuserDetailsEffect}
            setOpen={setOpen}
            called="userdetails"
          />
        </Modal>
      </Stack>
    </>
  );
}
