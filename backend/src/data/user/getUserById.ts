import { GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../clients/AWS";
import { GetUserByIdInput } from "../../data/interfaces/interface.user";
import { getEnv } from "../../../lib/utils/getEnv";

const env = getEnv()

if(!env.DYNAMO_DB_TABLE_NAME){throw new Error('DYNAMO_DB_TABLE_NAME missing')}

export const getUserById =async (input: GetUserByIdInput) => {
    const { id } = input
    try {
        const getUserParams: GetItemCommandInput = {
            TableName: env.DYNAMO_DB_TABLE_NAME,
            Key: {
                PK: {S: `User#${id}`},
                SK: {S: `User#${id}`}
            }
        }
        const userData = await dynamoDBClient.send(new GetItemCommand(getUserParams))
        return userData
    } catch (error) {
        console.log(error)
        return error
    }
}