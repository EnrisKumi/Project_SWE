import { connectDataBase } from "../../data/db/connection";
import { Post, User } from "../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {

    context.callbackWaitsForEmptyEventLoop = false;

    const userId = event.queryStringParameters.userId;
    const postId = event.queryStringParameters.postId;

    try {
        await connectDataBase()

        const user = await User.findById(userId);

        const joinAtPost = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { joined: userId } },
            { new: true }
        )

        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Allow": "GET, OPTIONS, POST",
                "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
                "Access-Control-Allow-Headers": "*"
            },
            statusCode: 200,
            body: JSON.stringify("!!!!!!!!!!!!!!!!!")
        };
    } catch (error) {
        return (error);
    }

}