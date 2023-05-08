import { Stack, StackProps } from "aws-cdk-lib"
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { lambdaProps } from "../utils/lambdaProps"
import { getContext } from "../utils/context"
import path = require("path")
import { Table } from "aws-cdk-lib/aws-dynamodb"

export interface ApiStackProps extends StackProps {
    mainTable: Table
}

export class ApiStack extends Stack {
    apiUrl: String
    constructor(scope: Construct, id: string, props: ApiStackProps){
        super(scope, id, props)

        const context = getContext(this);
        const {env} = context;

        const api = new RestApi(this, 'SocialMedia-API',{
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        })

        /**
         * /editUser,
         * desc => an endpoint to edit user
         */
        const editUser = api.root.addResource('editUser');
        const editUserLambda = new NodejsFunction(this, 'Edit-User',{
            ...lambdaProps,
            functionName: 'Edit-User',
            entry: path.join(__dirname, '../../src/lambdas/api/editUserHandler.ts'), 
            environment: {
                ...env
            }
        })
        props.mainTable.grantReadWriteData(editUserLambda)
        editUser.addMethod('POST', new LambdaIntegration(editUserLambda));

        /**
         * /editPost,
         * desc => an endpoint to edit post
         */
        const editPost = api.root.addResource('editPost');

        const editPostLambda = new NodejsFunction(this, 'Edit-Post',{
            ...lambdaProps,
            functionName: 'Edit-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/editPostHandler.ts'), 
            environment: {
                ...env
            }
        })

        editPost.addMethod('POST', new LambdaIntegration(editPostLambda));
        props.mainTable.grantReadWriteData(editPostLambda)

        /**
         * /getUser
         * desc => an endpoint to get User
         */
        const getUser = api.root.addResource('getUser')

        const getUserLambda = new NodejsFunction(this, 'Get-User',{
            ...lambdaProps,
            functionName: 'Get-User',
            entry: path.join(__dirname, '../../src/lambdas/api/getUserById.ts'),
            environment: {
                ...env
            }
        })

        getUser.addMethod('GET', new LambdaIntegration(getUserLambda))
        props.mainTable.grantReadData(getUserLambda)

        

        this.apiUrl = api.url
    }
}