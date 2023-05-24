import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;   // will follow
  const followersId = event.queryStringParameters.followersId;   //will be followed

  try {
    await connectDataBase()
    const user1 =await User.findOneAndUpdate(
      {_id : followersId},
      {$push: {followers: id}},
      //{$push: {followers: id, followed: followersId}},
      {new : true},
    );

    const user2 = await User.findOneAndUpdate(
      {_id: id},
      {$push : {followed: followersId}},
      {new : true}
    )
    console.log(user1)
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(user1),
    };
  } catch (error) {
    return error;
  }
};