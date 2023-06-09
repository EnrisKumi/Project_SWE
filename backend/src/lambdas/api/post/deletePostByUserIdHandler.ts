import { connectDataBase } from "../../../data/db/connection";
import { Post, User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.queryStringParameters.userId;
  const postId = event.queryStringParameters.postId;


  try {
    await connectDataBase()
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { posts: postId } },
      { new: true },
    )
    const post = await Post.findByIdAndRemove(postId);
    
    if (!user) {
      throw new Error(`No post found with id: ${userId}, cannot delete`);
    }

    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*"
      },
      statusCode: 200,
      body: JSON.stringify("!!!!!!!!!!!!!!!DONE!!!!!!!!!!!!!!!!!!!"),
    };
  } catch (error) {
    return (error);
  }
};