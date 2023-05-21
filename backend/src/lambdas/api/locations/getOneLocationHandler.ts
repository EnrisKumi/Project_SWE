import { connectDataBase } from "../../../data/db/connection";
import { LocationTag } from "../../../data/models/LocationTag";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
      await connectDataBase();
      const location = await LocationTag.findById(id);
  
      if (!location) {
        throw new Error(`No location found with id: ${id}`);
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
        body: JSON.stringify(location),
      };
    } catch (error) {
      return(error);
    }
  };