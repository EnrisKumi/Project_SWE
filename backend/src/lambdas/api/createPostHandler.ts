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
    const {body, identity} = parseGwEvent(event)

    try {

        const user: any = await getUserById({id: identity?.claims?.sub})
        if(!user) { throw new Error('User not found') }

        const username = user?.Item?.Username?.S

        const generatedId = uuidv4()
        const date = new Date()
        const startTime = new Date(body?.startTime)
        
        let status

        if((date.getTime() - startTime.getTime()) > 0){
            status = 'Not Started'
        } else {
            status = 'Completed'
        }

        const createPostParams: PutCommandInput = {
            TableName: process.env.DYNAMO_DB_TABLE_NAME,
            Item: {
                PK: `Post#${generatedId}`,
                SK: `Post#${identity?.claims?.sub}`,
                Username: username,
                Text: body?.text,
                Status: status,
                Tags: [],
                Date: date,
                StartTime: body?.startTime,
                Limit: body?.limit,
                Likes: [],
                Joined: [],
                Comment: []
            }
        }

        const createPostResponse = await dynamoDBClient.send(new PutCommand(createPostParams))
        console.log(createPostResponse)

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}