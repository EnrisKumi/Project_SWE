const connectToDatabase = require('../../database/db');
const User = require('../../models/User');


module.exports.getUserByCognitoId = async (event: any, context: any, callback: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const cognitoId = event.pathParameters.cognitoId;     
    console.log(cognitoId , " id here");
  
    try {
      await connectToDatabase();
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