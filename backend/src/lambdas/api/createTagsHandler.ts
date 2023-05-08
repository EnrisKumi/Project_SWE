import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { gwError } from "../../../lib/utils/gwError";


export const handler:APIGatewayProxyHandler =async (event, context, callback) => {
    //const {body, identity} = parseGwEvent(event)
    const {body} = parseGwEvent(event)

    console.log(JSON.stringify(event))
    console.log(context)


    try {

        const tagName : string = body.tagName;

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}