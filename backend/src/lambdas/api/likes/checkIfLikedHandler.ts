import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;
  const postId = event.queryStringParameters.postId;

  try {
    await connectDataBase()
    let booleanResponse

    const likeCheck = await Post.findById(postId);
    if(likeCheck){
        booleanResponse = likeCheck.likes.includes(id);
    }
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