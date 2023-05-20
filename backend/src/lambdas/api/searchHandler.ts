import { connectDataBase } from "../../data/db/connection";
import { Post } from "../../data/models/Post";
import { User } from "../../data/models/User";


export const search = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDataBase()
    const querystring = event.queryStringParameters;
    let filter = {};
    filter = querystring.searchQuery;

    const post = await Post.find({
      $or: [{ username: { $regex: filter, $options: "i" } }, { text: { $regex: filter, $options: "i" } }],
    });

    const user = await User.find({
      $or: [
        { username: { $regex: filter, $options: "i" } },

      ],
    });
    if (!user) {
      throw new Error("No users Found.");
    }

    if (!post) {
        throw new Error("No posts Found.");
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
      body: JSON.stringify(user),
    };
  } catch (error) {
    return error;
  }
};