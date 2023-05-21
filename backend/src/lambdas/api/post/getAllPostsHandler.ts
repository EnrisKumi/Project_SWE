import { connectDataBase } from "../../../data/db/connection";
import { Post } from "../../../data/models/Post";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const querystring = event.queryStringParameters;
        let filter = {};
        filter = querystring.page;
        console.log(querystring.page)
        let skipValue = (querystring.page - 1) * 10;
        await connectDataBase()
        let totalDocuments = await Post.count();
        console.log(totalDocuments);
        let totalPages = Math.ceil(totalDocuments / 10);
        console.log(totalPages);
        const post = await Post.find().skip(skipValue).limit(10).sort({ date: -1 });

        const dateNow = Math.floor(Date.now() / 1000);

        for (let index = 0; index < post.length; index++) {
            const { startTime } = post[index];
            if(!startTime){ throw new Error('Start time mot found')}
            const startTimeU = new Date(startTime)
            const startTimeUnix = Math.floor(startTimeU.getTime() / 1000);
            if (startTimeUnix < dateNow) {

                post[index].status = "Completed";
            }
            else {
                post[index].status = "OnGoing";
            }
        }

        if (!post) {
            throw new Error('No posts Found!');
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
            body: JSON.stringify({ post }),
        };
    } catch (error) {
        return (error);
    }
};