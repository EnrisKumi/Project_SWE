import { connectDataBase } from "../../../data/db/connection";
import { Comment } from "../../../data/models/Comments";

export const handler = async (event:any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;
  
    try {
      await connectDataBase()
      const comment = await Comment.findByIdAndRemove(id);
      if (!comment) {
        throw new Error(`No comment found with id: ${id}, cannot delete`);
      }
      console.log(comment)
      return {
        headers: {
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify({
          message: `Removed comment with id: ${comment._id}`,
          comment,
        }),
      };
    } catch (error) {
      return(error);
}};