import { APIGatewayProxyHandler } from "aws-lambda";
import { gwError } from "../../../lib/utils/gwError";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { dynamoDBClient } from "../../clients/AWS";
import { QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { Post } from "../../data/db/entities/Post";


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