import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/User";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;
  const followersId = event.queryStringParameters.followersId;

  try {
    await connectDataBase()
    let booleanResponse
    
    const userFollower = await User.findById(followersId);
    if(userFollower){
        booleanResponse = userFollower.followers.includes(id)
    }
   console.log(booleanResponse)
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(booleanResponse),
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};