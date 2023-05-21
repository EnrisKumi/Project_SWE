import { connectDataBase } from "../../../data/db/connection";
import { SportsTag } from "../../../data/models/SportsTag";

export const handler = async (event:any, context:any, callback: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;
  
    try {
      await connectDataBase()
      const sport = await SportsTag.findByIdAndRemove(id);
      if (!sport) {
        throw new Error(`No sport found with id: ${id}, cannot delete`);
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
        body: JSON.stringify({
          message: `Removed sport with id: ${sport._id}`,
          sport,
        }),
      };
    } catch (error) {
      return(error);
    }
  };