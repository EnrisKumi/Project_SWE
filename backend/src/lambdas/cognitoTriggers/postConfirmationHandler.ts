import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb"
import { PostConfirmationTriggerHandler } from "aws-lambda"
import { dynamoDBClient } from "../../clients/AWS"

export const handler: PostConfirmationTriggerHandler = async (event, context, callback) => {
    console.log(JSON.stringify(event))
    console.log(context)

    if(event.triggerSource === 'PostConfirmation_ConfirmSignUp'){
        try {
            const { userName } = event

            const signUpTime = new Date().toISOString()

            if (!process.env.DYNAMO_DB_TABLE_NAME) {
                throw new Error('DynamoDB table not found!')
              }

            const postAuthPutUserParams: PutItemCommandInput  = {
                TableName: process.env.DYNAMO_DB_TABLE_NAME,
                ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
                Item: {
                    PK: {S: `User#${event.request.userAttributes.sub}`},
                    SK: {S: `User#${event.request.userAttributes.sub}`},
                    Username: {S: userName},
                    SignUpTime: {S: signUpTime}
                }
            }
        
            const postAuthPutUserResponse = await dynamoDBClient.send(new PutItemCommand(postAuthPutUserParams))
            console.log(postAuthPutUserResponse)

            callback(null, event)
        } catch (error) {
            console.log(error)
            callback(new Error('Something went wrong!'))
        }
    } else {
        callback(null, event)
    }

}