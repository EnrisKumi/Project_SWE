import { connectDataBase } from "../../../data/db/connection";
import { SportsTag } from "../../../data/models/SportsTag";

export const getSports = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      await connectDataBase()
      const sports = await SportsTag.find();
      if (!sports) {
        throw new Error('No sports Found.');   
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
  