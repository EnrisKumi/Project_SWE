import { ListUsersCommand, ListUsersCommandInput } from "@aws-sdk/client-cognito-identity-provider";
import { cognito } from "../../clients/AWS";
import { GetCognitoUserById } from "../../data/interfaces/interface.user";
import { getEnv } from "../../../lib/utils/getEnv";

const env = getEnv()

if(!env.USER_POOL_ID){ throw new Error('USER_POOL_ID missing')}

export const getCognitoUserById = async (input: GetCognitoUserById) => {

    try {
        const { id } = input
        const getCognitoUserParams: ListUsersCommandInput = {
            UserPoolId: env.USER_POOL_ID,
            Filter: `sub = "${id}"`
        }

        const response = await cognito.send(
            new ListUsersCommand(getCognitoUserParams)
        )

        const users = response?.Users ?? []
        const [cognitoUser] = users
        const user: Record<string, any> = { ...cognitoUser }

        return user
        
    } catch (error) {
        console.log(error)
        return error
    }
}