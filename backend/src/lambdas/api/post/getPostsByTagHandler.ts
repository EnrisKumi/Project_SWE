import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDataBase()
    const querystring = event.queryStringParameters;
    let filter = {};
    filter = querystring.tags.split(",");
    let page = {};
    page = querystring.page;
    // console.log(querystring.page);
    let skipValue = (querystring.page - 1) * 10;

    let totalDocuments = await Post.count({ "tags": filter });
    console.log(totalDocuments);
    let totalPages = Math.ceil(totalDocuments / 10);
    console.log(totalPages);

    const post = await Post.find({ "tags": filter })
      .skip(skipValue)
      .limit(10)
      .sort({ date: -1 });

    if (!post) {
      throw new Error("No posts Found.")
    }
    console.log(post)
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Allow": "GET, OPTIONS, POST",
        "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
        "Access-Control-Allow-Headers": "*",
      },
      statusCode: 200,
      body: JSON.stringify(post),
    };
  } catch (error) {
    return error;
  }
};