import { connectDataBase } from "../../../data/db/connection";
import { SportsTag } from "../../../data/models/SportsTag";

export const getOneSport = async (event: any, context:any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
      await connectDataBase()
      const sports = await SportsTag.findById(id);
  
      if (!sports) {
        throw new Error(`No sport found with id: ${id}`);
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