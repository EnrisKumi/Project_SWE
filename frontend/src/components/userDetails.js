import {
  Avatar,
  Button,
  Modal,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, {  useEffect, useState } from "react";


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
  effectRun,
  seteffectRun,
  setdividerLoading,
  settabValue,
  tabValue,
  cognitoId
}) {

  const { user, currentUser } = useAuthContext();
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };
  const navigate = useNavigate();
  const [isFollowed, setisFollowed] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFollowedUModalClose = () => setFollowedU(false);
  const handleFollowersUModalClose = () => setFollowersU(false);

  const [runEffect, setrunEffect] = useState(false);
  const [loading, setloading] = useState(false);
  const [followersU, setFollowersU] = useState(false);
  const [followedU, setFollowedU] = useState(false);
  const [userDetailsEffect, setuserDetailsEffect] = useState(false);
  const [followedEffect, setfollowedEffect] = useState(false);

  const [c, setC] = useState("")
  const [bio, setBio] = useState("")
  const [username, setUsername] = useState("")
  const [location, setLocation] = useState("")
  const [prfilePicture, setPrfilePicture] = useState("")
  const [userId, setUserId] = useState("")
  const [followed, setFollowed] = useState([])
  const [followers, setFollowers]= useState([])

  const getUserFromDatabase = async(cognitoId) => {
    const res = await axios.get(`${url}user/getCognitoUserById?cognitoId=${cognitoId}`,
    requestInfo)
    return res.data
  }

  useEffect(() => {
    getUserFromDatabase(cognitoId).then((res)=>{
      setC(res.userCognitoId)
      setBio(res.bio)
      setLocation(res.location)
      setUsername(res.username)
      setPrfilePicture(res.prfilePicture)
      setUserId(res._id)
      setFollowed(res.followed)
      setFollowers(res.followers)
    })
  }, [c]);

  const handleReload = () => {
    window.location.reload();
  };


  const checkId = c === currentUser?.data.userCognitoId

  const follow = async (e, currentUserMongoId, userMongoId) => {
    e.preventDefault();
    const idk = await axios.get(
      `${url}follow/followUser?id=${currentUserMongoId}&followersId=${userMongoId}`,
      requestInfo
    );
    setrunEffect(true);
    setTimeout(function(){
      window.location.reload();
   }, 100);
  };
  //////////////////////////////////

  //////////////////////////////////
  const unfollow = async (e, currentUserMongoId, userMongoId) => {
    e.preventDefault();
    const idk = await axios.get(
      `${url}follow/unfollow?id=${currentUserMongoId}&followersId=${userMongoId}`,
      requestInfo
    );
    setrunEffect(true);
    setTimeout(function(){
      window.location.reload();
   }, 5000);
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
            unfollow(e, mongoId, userId);
          }}
        >
          Unfollow
        </Button>
      ) : null}
    </>
  );
  useEffect(() => {
    setdividerLoading(false)
  }, [open, isFollowed, effectRun, userDetailsEffect, followedEffect]);

  useEffect(() => {
    setdividerLoading(false);
  }, [open, isFollowed, effectRun, userDetailsEffect, followedEffect]);

  useEffect(() => {
    checkFollow(mongoId, userId).then((bool) => setisFollowed(bool));
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
              src={prfilePicture}
              sx={{
                bgcolor: "#3C3A3B",
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
                    {followers?.length === 1 ? `Followers` : ` Followers `}
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
      <Stack flex={4} flexDirection="column" py="15px">
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
                onClick={(e) => {
                  setOpen(true) 
                 }}
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
            userId={checkId ? mongoId : userId}
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