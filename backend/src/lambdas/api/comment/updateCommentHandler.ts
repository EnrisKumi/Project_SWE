import { connectDataBase } from "../../../data/db/connection";
import { Comment } from "../../../data/models/Comments";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDataBase()

    const reqBody = JSON.parse(event.body);
    const updateComments = await Comment.updateOne(
      {
        _id: event.queryStringParameters.id,
      },
      {
        text: reqBody.text,
      }
    )
    console.log(updateComments)
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(updateComments),
    };
  } catch (error) {
    return(error);
  }
};