import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/User";

export const deleteUser = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.pathParameters.id;
  
    try {
      await connectDataBase()
      const user = await User.findByIdAndRemove(id);
      if (!user) {
        throw new Error(`No user found with id: ${id}, cannot delete`);
      }
      return {
        headers: {
          "Content-Type" : "application/json",
          "Access-Control-Allow-Origin" : "*",
          "Allow" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
          "Access-Control-Allow-Headers" : "*"
      },
        statusCode: 200,
        body: JSON.stringify({
          message: `Removed user with id: ${user._id}`,
          user,
        }),
      };
    } catch (error) {
      return(error);
}};