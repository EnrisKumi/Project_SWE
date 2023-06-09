import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;
  const followersId = event.queryStringParameters.followersId;

  try {
    await connectDataBase()
    const user1 =await User.findOneAndUpdate(
      {_id : followersId},
      {$pull: {followers: id}},
      {new : true},
    );
    
    if (!user1) { throw new Error('User not found') }

    const user2 =await User.findOneAndUpdate(
      {_id : id},
      {$pull: {followed: followersId}},
      {new : true},
    );
    console.log(user1.followers);
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(user1.followers),
    };
  } catch (error) {
    return error;
  }
};