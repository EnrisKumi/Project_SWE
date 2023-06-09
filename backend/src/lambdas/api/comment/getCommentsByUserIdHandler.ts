import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";


export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;
  
    try {
      await connectDataBase()
      const user: any = await User.findById(id).populate("posts");
      if (user) { 
        const post = await user.find('posts')
      }
      console.log(user?.posts?.comment)
      return {
        headers: {
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify(user.posts.comment),
      };
    } catch (error) {
      return(error);
    }
};