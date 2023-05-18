import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/User";

export const updateUser = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDataBase()

    const reqBody = JSON.parse(event.body);

    const updateUser = await User.updateOne(
      {
        _id: event.pathParameters.id
      },   
      {
        location: reqBody.location,
        bio: reqBody.bio,
        prfilePicture: reqBody.prfilePicture
      }
    )

    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*"
      },
      statusCode: 204,
      body: JSON.stringify(updateUser),
    };
  } catch (error) {
    return(error);
  }
};

/*module.exports.updateUser = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const data = JSON.parse(event.body);

  const { username, location, bio } = data;

  try {
    await connectToDatabase();

    const user = await User.findById(event.pathParameters.id);

    if (user) {
      user.username = username || user.username;
      user.location = location || user.location;
      user.bio = bio || user.bio;
    }

    const newUser = await user.save();

    return {
      headers: {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*",
        "Allow" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods" : "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers" : "*"
    },
      statusCode: 204,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    returnError(error);
  }
};*/