import { useParams } from "react-router";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useEffect, useState } from "react";
import { Box, Divider, Skeleton, Stack, Tab, Tabs } from "@mui/material";
import Navbar from "../../components/navbar";
import NewPostModal from "../../components/newPostModal";
import UserDetails from "../../components/userDetails";
import Feed from "../../components/userFeed";
import axios from "axios";
const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

export default function UserProfile() {
  const { cognitoId } = useParams();
  const [effectRun, seteffectRun] = useState(false);
  const [dividerLoading, setdividerLoading] = useState(true);
  const [tabValue, settabValue] = useState("MyPosts");
  const [noPosts, setnoPosts] = useState(false);
  const [c, setC] = useState("")
  const [bio, setBio] = useState("")
  const [username, setUsername] = useState("")
  const [location, setLocation] = useState("")
  const [prfilePicture, setPrfilePicture] = useState("")
  const [userId, setUserId] = useState("")
  const [followed, setFollowed] = useState([])
  const [followers, setFollowers]= useState([])


  const { user, currentUser } = useAuthContext();
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

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

  const check = c === currentUser?.data.userCognitoId
  const handleChange = (event, newValue) => {
    settabValue(newValue);
    setnoPosts(false);
  };

  return (
    <>
      <Box sx={{ height: "100vh", backgroundColor: "background.myBackground" }}>
        <div>
          <Navbar called="userProfile" userId={cognitoId} />
        </div>

        <Stack pt={2} flexDirection="row" alignItems="center">
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              flex: { sm: 1, md: 2 },
            }}
          ></Box>
          <Stack flex={4} flexDirection="column" sx={{ backgroundColor: "" }}>
            <UserDetails
              setdividerLoading={setdividerLoading}
              seteffectRun={seteffectRun}
              effectRun={effectRun}
              userId={userId}
              bio={bio}
              location={location}
              settabValue={settabValue}
              tabValue={tabValue}
              prfilePicture={prfilePicture}
              followed={followed}
              followers={followers}
            />

            {dividerLoading ? (
              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem", width: 1, marginTop: 3 }}
              />
            ) : (
              <Divider sx={{ width: 1, marginTop: 3, fontWeight: 200 }}>
                {check ? (
                  <Tabs
                    sx={{ zIndex: 5 }}
                    textColor="text"
                    indicatorColor="primary"
                    aria-label="tabs "
                    centered
                    value={tabValue}
                    onChange={handleChange}
                  >
                    <Tab
                      sx={{ padding: "0px", marginX: "4px" }}
                      component="p"
                      value="MyPosts"
                      label="My Posts"
                    />
                    <Tab
                      sx={{ padding: "0px", marginX: "4px" }}
                      component="p"
                      value="JoinedPosts"
                      label="Joined Events"
                    />
                  </Tabs>
                ) : (
                  <>{`${username} Posts `}</>
                )}
              </Divider>
            )}
            <Stack>
              {" "}
              <Feed
                setnoPosts={setnoPosts}
                noPosts={noPosts}
                settabValue={settabValue}
                tabValue={tabValue}
                seteffectRun={seteffectRun}
                effectRun={effectRun}
                called="UserProfile"
                cognitoId={cognitoId}
              />
            </Stack>
          </Stack>
          <Box
            flex={2}
            sx={{
              display: { xs: "none", sm: "block" },
              flex: { sm: 1, md: 2 },
            }}
          ></Box>
        </Stack>
        <NewPostModal called="UserProfile" />
      </Box>
    </>
  );
}
