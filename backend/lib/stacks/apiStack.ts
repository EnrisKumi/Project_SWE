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

        const user = api.root.addResource('user')

        /**
         * get all users
         */
        const getAllUsers = user.addResource('getAllUsers')
        const getAllUsersLambda = new NodejsFunction(this, 'Get-All-Users',{
            ...lambdaProps,
            functionName: 'Get-All-Users',
            entry: path.join(__dirname, '../../src/lambdas/api/user/getUsersHandler.ts'),
            environment: {
                ...env
            }
        })
        getAllUsers.addMethod('GET', new LambdaIntegration(getAllUsersLambda), {
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get one user
         */
        const getUser = user.addResource('getUser')
        const getUserLambda = new NodejsFunction(this, 'Get-User',{
            ...lambdaProps,
            functionName: 'Get-User',
            entry: path.join(__dirname, '../../src/lambdas/api/user/getOneUserHandler.ts'),
            environment: {
                ...env
            }
        })
        getUser.addMethod('GET', new LambdaIntegration(getUserLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * check user exists
         */
        const checkUserExists = user.addResource('checkUserExists')
        const checkUserExistsLambda = new NodejsFunction(this, 'Check-User-Exists',{
            ...lambdaProps,
            functionName: 'Check-User-Exists',
            entry: path.join(__dirname, '../../src/lambdas/api/user/checkIfUserExistsHandler.ts'),
            environment: {
                ...env
            }
        })
        checkUserExists.addMethod('POST', new LambdaIntegration(checkUserExistsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get cognito user by id
         */
        const getCognitoUserById = user.addResource('getCognitoUserById')
        const getCognitoUserByIdLambda = new NodejsFunction(this, 'Get-Cognito-User-By-Id',{
            ...lambdaProps,
            functionName: 'Get-Cognito-User-By-Id',
            entry: path.join(__dirname, '../../src/lambdas/api/user/getCognitoUserHandler.ts'),
            environment: {
                ...env
            }
        })
        getCognitoUserById.addMethod('GET', new LambdaIntegration(getCognitoUserByIdLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * delete user
         */
        const deleteUser = user.addResource('deleteUser')
        const deleteUserLambda = new NodejsFunction(this, 'Delete-User',{
            ...lambdaProps,
            functionName: 'Delete-User',
            entry: path.join(__dirname, '../../src/lambdas/api/user/deleteUserHandler.ts'),
            environment: {
                ...env
            }
        })
        deleteUser.addMethod('DELETE', new LambdaIntegration(deleteUserLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * update user
         */
        const updateUser = user.addResource('updateUser')
        const updateUserLambda = new NodejsFunction(this, 'Update-Lambda',{
            ...lambdaProps,
            functionName: 'Update-User',
            entry: path.join(__dirname, '../../src/lambdas/api/user/updateUserHandler.ts'),
            environment: {
                ...env
            }
        })
        updateUser.addMethod('PATCH', new LambdaIntegration(updateUserLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        const comment = api.root.addResource('comment')

        /**
         * delete comment
         */
        const deleteComment = comment.addResource('deleteComment')
        const deleteCommentLambda = new NodejsFunction(this, 'Delete-Comment',{
            ...lambdaProps,
            functionName: 'Delete-Comment',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/deleteCommentHandler.ts'),
            environment: {
                ...env
            }
        })
        deleteComment.addMethod('DELETE', new LambdaIntegration(deleteCommentLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get comment at post
         */
        const getCommentAtPost = comment.addResource('getCommentAtPost')
        const getCommentAtPostLambda = new NodejsFunction(this, 'Get-Comment-At-Post', {
            ...lambdaProps,
            functionName: 'Get-Comment-At-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/getCommentAtPostHandler.ts'),
            environment: {
                ...env
            }
        })
        getCommentAtPost.addMethod('GET', new LambdaIntegration(getCommentAtPostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get comments by user id
         */
        const getCommentsByUserId = comment.addResource('getCommentsByUserId')
        const getCommentsByUserIdLambda = new NodejsFunction(this, 'Get-Comments-By-User-Id',{
            ...lambdaProps,
            functionName: 'Get-Comments-By-User-Id',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/getCommentsByUserIdHandler.ts'),
            environment: {
                ...env
            }
        })
        getCommentsByUserId.addMethod('GET', new LambdaIntegration(getCommentsByUserIdLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get one comment
         */
        const getOneComment = comment.addResource('getOneComment')
        const getOneCommentLambda = new NodejsFunction(this, 'Get-One-Comment',{
            ...lambdaProps,
            functionName: 'Get-One-Comment',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/getOneCommentHandler.ts'),
            environment: {
                ...env
            }
        })
        getOneComment.addMethod('GET', new LambdaIntegration(getOneCommentLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * post comment at post
         */
        const postCommentAtPost = comment.addResource('postCommentAtPost')
        const postCommentAtPostLambda = new NodejsFunction(this, 'Post-Commet-At-Post',{
            ...lambdaProps,
            functionName: 'Post-Commet-At-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/postCommentAtPostHandler.ts'),
            environment: {
                ...env
            }
        })
        postCommentAtPost.addMethod('POST', new LambdaIntegration(postCommentAtPostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * update comment
         */
        const updateComment = comment.addResource('updateComment')
        const updateCommentLambda = new NodejsFunction(this, 'Update-Comment',{
            ...lambdaProps,
            functionName: 'Update-Comment',
            entry: path.join(__dirname, '../../src/lambdas/api/comment/updateCommentHandler.ts'),
            environment: {
                ...env
            }
        }) 
        updateComment.addMethod('PUT', new LambdaIntegration(updateCommentLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        
        this.apiUrl = api.url
    }
}