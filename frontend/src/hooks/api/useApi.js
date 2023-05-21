import { useAuthContext } from '../auth/useAuthContext'
import axios from "axios";

const url =
  "https://2pj6vv3pwi.execute-api.eu-central-1.amazonaws.com/prod/";

  
export function useApi() {

    const { user } = useAuthContext();

    const cognitoId = user.attributes.sub
    const token = user.signInUserSession.idToken.jwtToken;

    const getMongoIdFromCognitoId = async () => {
    
        const requestInfo = {
          headers: {
            Authorization: token,
          },
        };
        const res = await axios.get(
            `${url}post/getAllPosts?page=1`,
          requestInfo
        );
      
        return res;
      };

  return {getMongoIdFromCognitoId}
}





  