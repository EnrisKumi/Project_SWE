const connectToDatabase = require("../../database/db");
const SportsTag = require('../../models/SportsTag');

module.exports.getOneSport = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
      await connectToDatabase();
      const sports = await SportsTag.findById(id);
  
      if (!sports) {
        callback(null, (404, `No sport found with id: ${id}`));
      }
  
      return {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Allow": "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers": "*"
        },
        statusCode: 200,
        body: JSON.stringify(sports),
      };
    } catch (error) {
      return(error);
    }
  };