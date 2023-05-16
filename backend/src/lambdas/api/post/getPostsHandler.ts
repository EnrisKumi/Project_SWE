import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { Post } from "../../../data/db/entities/Post";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";


export const handler: APIGatewayProxyHandler = async (event) => {
    const { claims } = parseGwEvent(event)
    try {

        const getPostInstance = new Post({sub: claims.sub})

        const result = await getPostInstance.query()

        return gwResponse(result)
    } catch (error) {
        console.log(error)
        return gwError(error)
    }
    
}