import { connectDataBase } from "../../../data/db/connection";
import { Post, User } from "../../../data/models/modelsConfig";

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
  console.log("🚀 ~ file: createPostAtUserHandler.ts:30 ~ handler ~ post:", post)

  try {
    await connectDataBase();
    const createPost = await Post.create(post);
    console.log("🚀 ~ file: createPostAtUserHandler.ts:35 ~ handler ~ createPost:", createPost)
    const createdPost = await User.findOneAndUpdate(
      { _id: id },
      { $push: { posts: createPost._id } },
      { new: true }
    );
    console.log("🚀 ~ file: createPostAtUserHandler.ts:40 ~ handler ~ createdPost:", createdPost)

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
    console.log(error)
    return error;
  }
};
