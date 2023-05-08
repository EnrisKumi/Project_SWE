import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { gwError } from "../../../lib/utils/gwError";
import { UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../clients/AWS";

export const handler: APIGatewayProxyHandler = async (event) => {
    //const {body, identity} = parseGwEvent(event)
    const {body} = parseGwEvent(event)

    try {

        const description : string = body.description;
        //const username : string = body.username;
        const postDate : string = body.postDate;   //: Date =
        const startDate : string = body.startDate; //: Date =
        const limit : number = body.limit;
        const sub : string = body.sub
        console.log(JSON.stringify(body));

        const updateDynamoParams : UpdateItemCommandInput = {
            TableName : process.env.DYNAMO_DB_TABLE_NAME,
            Key : {
                PK: {S: `Post#${sub}`},  //{identity?.claims?.
                SK: {S: `User#${sub}`}   // todo check   
            },
            UpdateExpression : "SET #description = :d, #postDate = :pd, #startDate = :sd, #limit = :l", 
            ExpressionAttributeValues : {
                ":d" : {S: description},
                ":pd" : {S: postDate},
                ":sd" : {S: startDate},
                ":l" : {N: limit.toString()}
            },
            ExpressionAttributeNames: {
                "#description": "Description",
                "#postDate": "PostDate",
                "#startDate": "StartDate",
                "#limit": "Limit"
            },
        };
        const clientResponse = await dynamoDBClient.send(new  UpdateItemCommand(updateDynamoParams));
        console.log(clientResponse);

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}