// const connectToDatabase = require('../../database/db');
// const User = require('../../models/User');


module.exports.getUserById = async (event:any,  context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
    //   await connectToDatabase();
    //   const user = await User.findById(id)
  
    //   if (!user) {
    //     callback(null, (404, `No user found with id: ${id}`));
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
        body: JSON.stringify('user'),
      };
    } catch (error) {
      return(error);
    }
};