/*const connectToDatabase = require('../../database/db');
const User = require('../../models/User');
const Post = require('../../models/Post');


module.exports.deletePost = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.pathParameters.id;
  //const postId = event.pathParameters.postId;


  // try {
  //   await connectToDatabase();
  //   const user = await User.findOneAndUpdate(
  //     { _id: userId },
  //     { $pull: { posts: postId } },
  //     { new: true },
  //   )
  //   if (!user) {
  //     callback(null, (404, `No post found with id: ${userId}, cannot delete`));
  //   }

  //   return {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       "Allow": "GET, OPTIONS, POST",
  //       "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
  //       "Access-Control-Allow-Headers": "*"
  //     },
  //     statusCode: 200,
  //     body: JSON.stringify("!!!!!!!!!!!!!!!DONE!!!!!!!!!!!!!!!!!!!"),
  //   };
  // } catch (error) {
  //   return (error);
  // }
};*/