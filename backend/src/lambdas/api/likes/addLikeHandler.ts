import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async(event: any, context:any) =>{

    context.callbackWaitsForEmptyEventLoop = false;
    const userId = event.queryStringParameters.userId;
    const postId = event.queryStringParameters.postId;

    try {
        await connectDataBase()

        const likePost = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { likes: userId } },
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
        return(error);
    }
}