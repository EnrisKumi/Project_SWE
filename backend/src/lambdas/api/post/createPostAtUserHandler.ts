import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";
import { User } from "../../../data/models/User";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;

  const {
    postCognitoId,
    username,
    text,
    tags,
    status,
    date,
    startTime,
    limit,
  } = JSON.parse(event.body);

  const post = new Post({
    postCognitoId,
    username,
    text,
    tags,
    status,
    date,
    startTime,
    limit,
  });

  try {
    await connectDataBase();
    console.log(post);
    const createPost = await Post.create(post);
    const createdPost = await User.findOneAndUpdate(
      { _id: id },
      { $push: { posts: createPost._id } },
      { new: true }
    );
    console.log(createdPost);

    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(createdPost),
    };
  } catch (error) {
    return error;
  }
};
