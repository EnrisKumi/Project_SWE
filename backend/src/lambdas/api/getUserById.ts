import { APIGatewayProxyHandler } from "aws-lambda";
import { gwError } from "../../../lib/utils/gwError";
import { getUserById } from "../../data/user/getUserById";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { claims } = parseGwEvent(event)
    try {
        const user = await getUserById({id: claims?.sub})
        if(!user) {throw new Error('User not found')}
        return gwResponse(user)
    } catch (error) {
        return gwError(error)
    }
}