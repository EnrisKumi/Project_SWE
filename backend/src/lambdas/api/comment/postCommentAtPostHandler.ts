import { connectDataBase } from "../../../data/db/connection";
import { Comment } from "../../../data/models/Comments";
import { Post } from "../../../data/models/Post";


export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;

  const { userName, commentCognitoId, text, date } = JSON.parse(event.body);

  const comments = new Comment({
    userName,
    commentCognitoId,
    text,
    date
  });

  try {
    await connectDataBase()
    console.log(comments);

    const createComment = await Comment.create(comments);
    const createdComment = await Post.findOneAndUpdate(
      { _id: id },
      { $push: { comment: createComment._id } },
      { new: true }
    );
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(createdComment),
    };
  } catch (error) {
    return (error);
  }
};