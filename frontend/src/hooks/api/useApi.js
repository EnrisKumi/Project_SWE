import { useAuthContext } from '../auth/useAuthContext'
import axios from "axios";

const url = "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

  
export function useApi() {

    const { user} = useAuthContext();

    const cognitoId = user.attributes.sub
    const token = user.signInUserSession.idToken.jwtToken;
    const requestInfo = {
      headers: {
        Authorization: token,
      },
    };

    const getMongoIdFromCognitoId = async () => {
        const res = await axios.get(`${url}post/getAllPosts?page=1`,
          requestInfo
        );
        return res;
      };

      const getUser = async() => {
        const res = await axios.get(`${url}user/getCognitoUserById?cognitoId=${cognitoId}`,
        requestInfo)
        return res.data
      }

      const getUserFromDatabase = async(userCognitoId) => {
        const res = await axios.get(`${url}user/getCognitoUserById?cognitoId=${userCognitoId}`,
        requestInfo)
        return res.data
      }

  return {getMongoIdFromCognitoId, getUser,getUserFromDatabase}
}

