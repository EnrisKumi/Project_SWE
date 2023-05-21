import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;

  try {
    await connectDataBase()
    const post: any = await Post.find({ joined: id }).sort({ date: -1 });

    const dateNow = Math.floor(Date.now() / 1000);

    if (!post) { throw new Error(`No post found with id: ${id}`) }
  
    for (let index = 0; index < post.length; index++) {
      const { startTime } = post[index];
      const startTimeU = new Date(startTime)
      const startTimeUnix = Math.floor(startTimeU.getTime() / 1000);
      if (startTimeUnix < dateNow) {

        post[index].status = "Completed";
      }
      else {
        post[index].status = "OnGoing";
      }
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
      body: JSON.stringify(post),
    };
  } catch (error) {
    return error;
  }
};