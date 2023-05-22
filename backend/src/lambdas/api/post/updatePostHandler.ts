import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  try {
    await connectDataBase()

    const reqBody = JSON.parse(event.body);

    const updatePosts = await Post.updateOne(
      {
        _id: event.queryStringParameters.id,
      },
      {
        text: reqBody.text,
        limit: reqBody.limit
      }
    )
    console.log(updatePosts);
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 204,
      body: JSON.stringify(updatePosts),
    };
  } catch (error) {
    return(error);
  }
};