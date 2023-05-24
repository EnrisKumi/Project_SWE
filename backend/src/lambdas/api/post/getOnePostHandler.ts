import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;
  
    try {
      await connectDataBase()
      const post = await Post.findById(id);
      // //console.log(post.startTime);
      const dateNow = Math.floor(Date.now()/1000);
      console.log(dateNow);

      if (!post) { throw new Error(`No post found with id: ${id}`) }
      if (!post.startTime) { throw new Error(`No startTime at post found with id: ${id}`) }
      if (!post.status) { throw new Error(`No status at post found with id: ${id}`) }

      const startTimeU = new Date(post.startTime)
      const startTimeUnix = Math.floor(startTimeU.getTime() / 1000);
      console.log(startTimeUnix + "!!!!!!!!!!!!!!!!!!!!!!");

      if(startTimeUnix < dateNow)
      {
        console.log("completed");
        post.status = 'true';
      }
      else{
        post.status = 'false';
      }

      console.log(post.status, post);
      
      return {
        headers: {
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify(post),
      };
    } catch (error) {
      return(error);
    }
};