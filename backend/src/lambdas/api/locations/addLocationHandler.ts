import { connectDataBase } from "../../../data/db/connection";
import { LocationTag } from "../../../data/models/LocationTag";

export const addLocations = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { text } = JSON.parse(event.body);

  try {
    await connectDataBase()
    const location = new LocationTag({
        text
    });

    const newLocation = await LocationTag.create(location);
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(newLocation),
    };
  } catch (error) {
    return error;
  }
};