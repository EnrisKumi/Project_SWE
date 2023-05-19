import { connectDataBase } from "../../../data/db/connection";
import { LocationTag } from "../../../data/models/LocationTag";

export const deleteLocation = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
      await connectDataBase()
      const location = await LocationTag.findByIdAndRemove(id);
      if (!location) {
        throw new Error(`No location found with id: ${id}, cannot delete`);
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
          message: `Removed location with id: ${location._id}`,
          location,
        }),
      };
    } catch (error) {
      return(error);
    }
  };
  