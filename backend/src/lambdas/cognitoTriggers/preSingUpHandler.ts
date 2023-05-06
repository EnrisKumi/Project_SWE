import { PreSignUpTriggerHandler } from "aws-lambda"
import { cognito } from "../../clients/AWS"
import { ListUsersCommand, ListUsersCommandInput } from "@aws-sdk/client-cognito-identity-provider"

export const handler: PreSignUpTriggerHandler = async (event, context, callback) => {
    console.log(JSON.stringify(event))
    console.log(context)

    // event.response.autoConfirmUser = true

    try {
        const listUsersParams: ListUsersCommandInput = {
            UserPoolId: event.userPoolId,
            AttributesToGet: [
                'email', 'email_verified'
              ],
              Filter: `email = "${event.request.userAttributes.email}"`
        }
        const { Users } = await cognito.send(new ListUsersCommand(listUsersParams))

        const cognitoResponse = Users ?? []

        if(cognitoResponse.length > 0){
            callback(new Error('Email Exists'))
        } else {
            callback(null, event)
        }
    } catch (error) {
        callback(new Error('Something went wrong!'))
    }
    callback(null, event)
}