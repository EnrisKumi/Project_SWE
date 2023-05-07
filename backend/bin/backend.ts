#!/usr/bin/env node
import { getDeploymentEnv } from '../lib/utils/env';
const env = getDeploymentEnv()

import { App } from 'aws-cdk-lib';
import { CognitoStack } from '../lib/stacks/cognitoStack';
import { S3Stack } from '../lib/stacks/s3Stack';
import { DynamoDBStack } from '../lib/stacks/dynamodbStack';
import { ApiStack } from '../lib/stacks/apiStack';


const app = new App();

const s3Stack = new S3Stack(app, 'S3Stack', {
    env
})

const dynamodbStack = new DynamoDBStack(app, 'DynamoDBStack', {
    env
})

const cognitoStack = new CognitoStack(app, 'CognitoStack',{
    env,
    mainTable: dynamodbStack.mainTable
})

const apiStack = new ApiStack(app, 'ApiStack',{
    env,
    mainTable: dynamodbStack.mainTable
})