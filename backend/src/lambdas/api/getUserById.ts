import { APIGatewayProxyHandler } from "aws-lambda";
import { gwError } from "../../../lib/utils/gwError";
import { getUserById } from "../../data/user/getUserById";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";


export const handler: APIGatewayProxyHandler = async (event) => {
    const { queryStringParameters } = parseGwEvent(event)
    try {
        const user = await getUserById({id: queryStringParameters.id})
        if(!user) {throw new Error('User not found')}
        return gwResponse(user)
    } catch (error) {
        return gwError(error)
    }
}