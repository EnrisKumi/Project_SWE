import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";
import { Post } from "../../../data/db/entities/Post";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { claims} = parseGwEvent(event)
    try {

        const deletePostInstance = new Post({
            sub: claims?.sub
        })

        const deletePostResponse = await deletePostInstance.delete()

        return gwResponse(deletePostResponse)
    } catch (error) {
        return gwError(error)
    }
}