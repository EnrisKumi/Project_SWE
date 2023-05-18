import { config } from "dotenv"

export const getEnv = () => {
    const stage = process.env.STAGE
    const path = stage 
    config({ path })
    const dynamoDbName = process.env.DYNAMO_DB_TABLE_NAME
    const userPoolId = process.env.USER_POOL_ID
    const dynamoDbPassword = process.env.DYNAMO_DB_PASSWORD
    return { DYNAMO_DB_TABLE_NAME: dynamoDbName, USER_POOL_ID: userPoolId, DYNAMO_DB_PASSWORD: dynamoDbPassword }
}