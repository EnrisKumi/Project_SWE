import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";
import { Tags } from "../../../data/db/entities/Tags";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { body, claims } = parseGwEvent(event)
    try {

        const createTag = new Tags({
            id: claims?.sub,
            text: body?.text
        })

        const createTagResponse = await createTag.save()

        return gwResponse(createTagResponse)
    } catch (error) {
        return gwError(error)
    }
}