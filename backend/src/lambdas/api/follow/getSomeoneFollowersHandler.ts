import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters.id;

  try {
    await connectDataBase();
    const user = await User.findById(id).populate("followers");

    if (!user) {
      throw new Error(`No user found with id: ${id}`);
    }
    console.log(user.followers);
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(user.followers),
    };
  } catch (error) {
    return error;
  }
};
