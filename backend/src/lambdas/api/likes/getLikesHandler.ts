import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const id = event.queryStringParameters.id;

    try {
        await connectDataBase()

        const post = await Post.findById(id).populate("likes");

        if (!post) {
            throw new Error(`No post found with id: ${id}`);
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
            body: JSON.stringify(post.likes),
        };
        
    } catch (error) {
        return(error)
    }
}