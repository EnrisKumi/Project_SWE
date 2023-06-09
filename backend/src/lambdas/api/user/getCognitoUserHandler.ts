import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log(event)
    const cognitoId = event.queryStringParameters.cognitoId;     
    console.log(cognitoId , " id here");
  
    try {
      await connectDataBase()
      const user = await User.findOne(
        {userCognitoId : cognitoId}
        )
      //.populate("posts");
  
    //   if (!user) {
    //     callback(null, (404, "No user found"));
    //   }
  
      return {
        headers: {
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify(user),
      };
    } catch (error) {
        console.log(error);
      return(error);
    }
};