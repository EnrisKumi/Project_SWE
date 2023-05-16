import { APIGatewayProxyHandler } from "aws-lambda";
import { gwError } from "../../../../lib/utils/gwError";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../../clients/AWS";


export const handler: APIGatewayProxyHandler = async (event) => {
    const { claims } = parseGwEvent(event)
    
    try {
        const getAllPosts: QueryCommandInput = {
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            KeyConditionExpression: 'PK = :post and SK = :psk',
            ExpressionAttributeValues: {
                ':post': 'Post',
                ':psk': `Post#${claims['cognito:username']}`
            }
        }
        const response = await dynamoDBClient.send(new QueryCommand(getAllPosts))

        return gwResponse(response)
    } catch (error) {
        return gwError(error)
    }
}