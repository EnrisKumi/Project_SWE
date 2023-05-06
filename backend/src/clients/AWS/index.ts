import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient} from "@aws-sdk/client-dynamodb";



export const dynamoDBClient = new DynamoDBClient({})
export const cognito = new CognitoIdentityProviderClient({})