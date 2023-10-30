import { Box, Divider, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import xIcon from "../icons/Group 182.png";
import { useAuthContext } from "../hooks/auth/useAuthContext";
import axios from "axios";
import UnFollowUsersLine from './unfollowUsersLine'
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

function FollowersData({
  _id,
  userId,
  setFollowersU,
  checkId,
  userDetailsEffect,
  setuserDetailsEffect,
  followedEffect,
  setfollowedEffect,
  seteffectRun,
  effectRun,
  settabValue,
  tabValue,
}) {
  const [followers, setFollowers] = useState();
  const [loading, setloading] = useState(true);
  const [effect, seteffect] = useState(false);

  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };
  ///////////////////////////////////////////////////////////////
  const getUserFollowers = async (userMongoId) => {
    const followers = await axios.get(
      `${url}follow/getYourFollowers?id=${userMongoId}`,
      requestInfo
    );

    return await followers.data;
  };

  ///////////////////////////////////////////////////////////////

  useEffect(() => {
    getUserFollowers(userId).then((followersss) => {
      setFollowers(followersss);
      setloading(false);
    });
  }, [effect]);

  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <Stack
      sx={{
        width: 400,
        height: 300,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 2,
        margin: { xs: 2 },
      }}
      alignItems="center"
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={10}
      >
        <IconButton onClick={() => setFollowersU(false)}>
          <img src={xIcon} height={20} width={20} alt="missing"/>
        </IconButton>

        <Typography
          sx={{ marginRight: "10%" }}
          fontSize="16px"
          color="gray"
          textAlign="center"
        >
          Followers
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
      {loading ? (
        <div style={style}>
          <MoonLoader color="grey" loading speedMultiplier={1} />
        </div>
      ) : (
        <Stack width={1} sx={{ overflow: "hidden", overflowY: "scroll" }}>
          {followers?.map((aFollower) => (
            <UnFollowUsersLine
              settabValue={settabValue}
              tabValue={tabValue}
              setFollowersU={setFollowersU}
              followedEffect={followedEffect}
              setfollowedEffect={setfollowedEffect}
              seteffectRun={seteffectRun}
              effectRun={effectRun}
              userDetailsEffect={userDetailsEffect}
              setuserDetailsEffect={setuserDetailsEffect}
              checkId={checkId}
              aFollower={aFollower}
              seteffect={seteffect}
              _id={userId}
              effect={effect}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default FollowersData;
