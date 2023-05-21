import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/User";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;
  
    try {
      await connectDataBase()
      const user = await User.findById(id).populate("posts");

      if (!user) { throw new Error(`No user found with id: ${id}`) }

      const post: any = user.posts

      if (!post) { throw new Error(`No post found with id: ${id}`) }

      const dateNow = Math.floor(Date.now() / 1000);

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
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify(user.posts),
      };
    } catch (error) {
      return(error);
    }
};