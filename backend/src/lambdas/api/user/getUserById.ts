import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { getUserById } from "../../../data/user/getUserById";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";


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