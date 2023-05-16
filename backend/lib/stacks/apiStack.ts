import { CfnOutput, Stack, StackProps } from "aws-cdk-lib"
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, RequestValidator, RestApi } from "aws-cdk-lib/aws-apigateway"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"
import { Construct } from "constructs"
import { lambdaProps } from "../utils/lambdaProps"
import { getContext } from "../utils/context"
import path = require("path")
import { Table } from "aws-cdk-lib/aws-dynamodb"
import { UserPool } from "aws-cdk-lib/aws-cognito"

export interface ApiStackProps extends StackProps {
    mainTable: Table
    userPool: UserPool
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

        const auth = new CognitoUserPoolsAuthorizer(this, 'CogntioAuth', {
            authorizerName: 'CognitoAuth',
            cognitoUserPools: [props.userPool]
        })

        const baseRequestValidator = new RequestValidator(this, 'RequestBodyAndParamsValidator',{
            restApi: api,
            requestValidatorName: 'RequestBodyAndParamsValidator',
            validateRequestBody: true,
            validateRequestParameters: true
        })

        /**
         * /getUser
         * desc => an endpoint to get User
         */
        const getUser = api.root.addResource('getUser')
        const getUserLambda = new NodejsFunction(this, 'Get-OneUser',{
            ...lambdaProps,
            functionName: 'Get-OneUser',
            entry: path.join(__dirname, '../../src/lambdas/api/user/getUserById.ts'),
            environment: {
                ...env
            }
        })
        getUser.addMethod('GET', new LambdaIntegration(getUserLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth,
            // requestValidator: baseRequestValidator
        })
        props.mainTable.grantReadData(getUserLambda)

        /**
         * /editUser
         * desc => an endpoint to edit user
         */
        const editUser = api.root.addResource('editUser')
        const editUserLambda = new NodejsFunction(this, 'Edit-User',{
            ...lambdaProps,
            functionName: 'Edit-User',
            entry: path.join(__dirname, '../../src/lambdas/api/user/editUserHandler.ts'),
            environment: {
                ...env
            }
        })
        editUser.addMethod('POST', new LambdaIntegration(editUserLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth,
            // requestValidator: baseRequestValidator
        })
        props.mainTable.grantReadWriteData(editUserLambda)


         /**
         * /createPost
         * desc => an endpoint to create post
         */
         const createPost = api.root.addResource('createPost')
         const createPostLambda = new NodejsFunction(this, 'Create-Post',{
            ...lambdaProps,
            functionName: 'Create-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/post/createPostHandler.ts'),
            environment: {
                ...env
            }
         })
         createPost.addMethod('POST', new LambdaIntegration(createPostLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth,
            // requestValidator: baseRequestValidator
         })
         props.mainTable.grantReadWriteData(createPostLambda)


         /**
          * /getPosts
          * desc => an endpoint to get all posts
          */
         const getPosts = api.root.addResource('getPosts')
         const getPostsLambda = new NodejsFunction(this, 'Get-Posts',{
            ...lambdaProps,
            functionName: 'Get-UserPosts',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getAllPostsHandler.ts'),
            environment: {
                ...env
            }
         })
         getPosts.addMethod('GET' ,new LambdaIntegration(getPostsLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth,
            // requestValidator: baseRequestValidator
         })
         props.mainTable.grantReadData(getPostsLambda)


          /**
          * /getUserPosts
          * desc => an endpoint to get user posts
          */
         const getUserPosts = api.root.addResource('getPostsUser')
         const getUserPostsLambda = new NodejsFunction(this, 'Get-PostsUser', {
            ...lambdaProps,
            functionName: 'Get-PostsUser',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getUserPostsHandler.ts'),
            environment: {
                ...env
            }
         })
         getUserPosts.addMethod('GET', new LambdaIntegration(getUserPostsLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth
         })
         props.mainTable.grantReadData(getUserPostsLambda)
         


          /**
          * /deletePost
          * desc => an endpoint to get delete post
          */
         const deletePost = api.root.addResource('deletePost')
         const deletePostLambda = new NodejsFunction(this, 'Delete-Post', {
            ...lambdaProps,
            functionName: 'Delete-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/post/deletePostHandler.ts'),
            environment: {
                ...env
            }
         })
         deletePost.addMethod('DELETE', new LambdaIntegration(deletePostLambda),{
            authorizationType: AuthorizationType.COGNITO,
            authorizer: auth
         })
         props.mainTable.grantReadWriteData(deletePostLambda)
        
        this.apiUrl = api.url
    }
}