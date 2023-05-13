import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { gwError } from "../../../lib/utils/gwError";
import { dynamoDBClient } from "../../clients/AWS";
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserById } from "../../data/user/getUserById";


export const handler:APIGatewayProxyHandler =async (event, context, callback) => {
    //const {body, identity} = parseGwEvent(event)
    const {body, claims} = parseGwEvent(event)

    try {

        const generatedId = uuidv4()
        const date = new Date()
        const startTime: string = body?.startTime
        const startTimeISo = new Date(startTime)
        const tags: string[] = body?.tags
        const limit: number = body?.limit
        const description: string = body?.text
        const location: string = body?.location

        const username = claims['cognito:username']
        
        let status

        if((date.getTime() - startTimeISo.getTime()) > 0){
            status = 'Not Started'
        } else {
            status = 'Completed'
        }

        console.log(username, description, status, tags, startTime, limit )

        const createPostParams: PutCommandInput = {
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            Item: {
                PK: `Post#${claims?.sub}`,
                SK: `Post#${generatedId}`,
                Username: username,
                Description: description,
                Status: status,
                Tags: tags,
                Date: date.toISOString(),
                StartTime: startTime,
                Limit: limit,
                Location: location
            }
        }

        const createPostResponse = await dynamoDBClient.send(new PutCommand(createPostParams))
        console.log(createPostResponse)

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}