import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { body } = parseGwEvent(event)
    try {
        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}