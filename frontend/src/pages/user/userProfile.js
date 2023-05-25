import { useParams } from "react-router";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useState } from "react";
import { Box, Divider, Skeleton, Stack, Tab, Tabs } from "@mui/material";
import Navbar from "../../components/navbar";
import NewPostModal from "../../components/newPostModal";
import UserDetails from "../../components/userDetails";
import Feed from "../../components/userFeed";


export default function UserProfile() {
//   const { cognitoId } = useParams();
  const [effectRun, seteffectRun] = useState(false);
  const [dividerLoading, setdividerLoading] = useState(true);
  const [tabValue, settabValue] = useState("MyPosts");
  const [noPosts, setnoPosts] = useState(false);
  const { user, currentUser } = useAuthContext();
  const cognitoId = user.attributes.sub;
  const mongoId = currentUser?.data._id;
  const bio = currentUser?.data.bio
  const location = currentUser?.data.location
  const token = user.signInUserSession.idToken.jwtToken;
  const requestInfo = {
    headers: {
      Authorization: token,
    },
  };

  const check = cognitoId === currentUser?.data.userCognitoId
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
              userId={cognitoId}
              bio={bio}
              location={location}
              settabValue={settabValue}
              tabValue={tabValue}
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
                  <>{`${user?.username} Posts `}</>
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
