import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { Post } from "../../../data/db/entities/Post";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";


export const handler: APIGatewayProxyHandler = async (event) => {
    const { claims } = parseGwEvent(event)
    try {

        const getPostInstance = new Post({username: claims['cognito:username']})

        const result = await getPostInstance.query()

        // const getAllPosts: QueryCommandInput = {
        //     TableName: process.env.DYNAMO_DB_TABLE_NAME,
        //     KeyConditionExpression: 'PK = :post and begins_with(SK, :psk)',
        //     ExpressionAttributeValues: {
        //         ':post': {S: 'Post'},
        //         ':psk': {S: 'Post'}
        //     }
        // }
        // const { Items } = await dynamoDBClient.send(new QueryCommand(getAllPosts))
        
        // const response = Items ?? {}

        return gwResponse(result)
    } catch (error) {
        console.log(error)
        return gwError(error)
    }
    
}