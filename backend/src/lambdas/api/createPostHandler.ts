import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { gwError } from "../../../lib/utils/gwError";
import { dynamoDBClient } from "../../clients/AWS";
import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";


export const handler:APIGatewayProxyHandler =async (event, context, callback) => {
    //const {body, identity} = parseGwEvent(event)
    const {body} = parseGwEvent(event)

    try {



        const createPostParams: PutItemCommandInput  = {
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            
        }

        const createPostResponse = await dynamoDBClient.send(new PutItemCommand(createPostParams))



        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}