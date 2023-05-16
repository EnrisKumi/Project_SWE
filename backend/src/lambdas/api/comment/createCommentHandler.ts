import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";
import { Comment } from "../../../data/db/entities/Comment";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { body, claims } = parseGwEvent(event)
    try {

        const createComment = new Comment({
            id: claims?.sub,
            username: claims['cognito:username'],
            text: body?.text
        }) 

        const createCommentResponse = await createComment.save()

        return gwResponse(createCommentResponse)
    } catch (error) {
        return gwError(error)
    }
}