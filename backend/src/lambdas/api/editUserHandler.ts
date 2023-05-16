import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../lib/utils/parseGwEvent";
import { gwResponse } from "../../../lib/utils/gwResponse";
import { gwError } from "../../../lib/utils/gwError";
import { User } from "../../data/db/entities/User";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {body, claims} = parseGwEvent(event)

    try {

        const userInstance = new User({
            id: claims.sub,
            bio: body.bio,
            location: body.location
        })

        await userInstance.update({})

        // const location : string = body.location;
        // const bio : string = body.bio;
        // const profilePicture : string = "";
        // const followers : number = 0;
        // const following : number = 0;
        // const sub : string = body.sub
        // console.log(JSON.stringify(body));

        // const updateDynamoParams : UpdateItemCommandInput = {
        //     TableName : process.env.DYNAMO_DB_TABLE_NAME,
        //     Key : {
        //         PK: {S: `User#${sub}`},  //{identity?.claims?.
        //         SK: {S: `User#${sub}`}
        //     },
        //     UpdateExpression : "SET #loc = :l, #bio = :b", 
        //     ExpressionAttributeValues : {
        //         ":l" : {S: location},
        //         ":b" : {S: bio}
        //     },
        //     ExpressionAttributeNames: {
        //         "#loc": "Location",
        //         "#bio": "Bio"
        //     },
        // };
        // const clientResponse = await dynamoDBClient.send(new  UpdateItemCommand(updateDynamoParams));
        // console.log(clientResponse);

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}