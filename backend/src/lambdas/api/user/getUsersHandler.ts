import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (callback: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const a = await connectDataBase()
        const users = await User.find()
        if (!users) {
            throw new Error('No Users Found.');
        }

        const response = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Allow": "GET, OPTIONS, POST",
                "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
                "Access-Control-Allow-Headers": "*"
            },
            statusCode: 200,
            body: JSON.stringify(users),
        }

        return response
    } catch (error) {
        return(error);
    }
};