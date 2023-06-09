import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    try {
        await connectDataBase()
        
        let totalDocuments = await Post.count();
        console.log(totalDocuments);
        let totalPages = Math.ceil(totalDocuments / 10);
        console.log(totalPages);

        return {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Allow": "GET, OPTIONS, POST",
                "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
                "Access-Control-Allow-Headers": "*"
            },
            statusCode: 200,
            body: JSON.stringify(totalPages),
        };
    } catch (error) {
        return(error);
    }
};