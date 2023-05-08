import { GetUserCommand, GetUserCommandInput, ListUsersCommand, ListUsersCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { cognito } from "../../clients/AWS";
import { GetCognitoUserById } from "../../data/interfaces/interface.user";
import { getEnv } from "../../../lib/utils/getEnv";

const env = getEnv()

if(!env.USER_POOL_ID){ throw new Error('USER_POOL_ID missing')}

export const getCognitoUserById = async (input: GetCognitoUserById) => {
    const { id } = input
    try {

        const getCognitoUserParams: ListUsersCommandInput = {
            UserPoolId: env.USER_POOL_ID,
            Filter: `sub = "${id}"`
        }

        const getCognitoUserResponse = await cognito.send(new ListUsersCommand(getCognitoUserParams))
        return getCognitoUserResponse.Users
        
    } catch (error) {
        console.log(error)
        return error
    }
}