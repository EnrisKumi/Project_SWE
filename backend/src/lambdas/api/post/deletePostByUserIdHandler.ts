import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";
import { User } from "../../../data/models/User";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userId = event.pathParameters.userId;
  const postId = event.pathParameters.postId;


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