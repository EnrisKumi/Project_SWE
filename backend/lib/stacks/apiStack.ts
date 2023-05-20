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


        const sport = api.root.addResource('sport')

        /**
         * add sport
         */
        const addSport = sport.addResource('addSport')
        const addSportLambda = new NodejsFunction(this, 'Add-Sport',{
            ...lambdaProps,
            functionName: 'Add-Sport',
            entry: path.join(__dirname, '../../src/lambdas/api/sports/addSportHandler.ts'),
            environment: {
                ...env
            }
        })
        addSport.addMethod('POST', new LambdaIntegration(addSportLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * delete sport
         */
        const deleteSport = sport.addResource('deleteSport')
        const deleteSportLambda = new NodejsFunction(this, 'Delete-Sport', {
            ...lambdaProps,
            functionName: 'Delete-Sport',
            entry: path.join(__dirname, '../../src/lambdas/api/sports/deleteSportHanlder.ts'),
            environment: {
                ...env
            }
        })
        deleteSport.addMethod('DELETE', new LambdaIntegration(deleteSportLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get one sport
         */
        const getOneSport = sport.addResource('getOneSport')
        const getOneSportLambda = new NodejsFunction(this, 'Get-One-Sport',{
            ...lambdaProps,
            functionName: 'Get-One-Sport',
            entry: path.join(__dirname, '../../src/lambdas/api/sports/getOneSportHandler.ts'),
            environment: {
                ...env
            }
        })
        getOneSport.addMethod('GET', new LambdaIntegration(getOneSportLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get sports
         */
        const getSports = sport.addResource('getSports')
        const getSportsLambda = new NodejsFunction(this, 'Get-Sports', {
            ...lambdaProps,
            functionName: 'Get-Sports',
            entry: path.join(__dirname, '../../src/lambdas/api/sports/getSportsHandler.ts'),
            environment: {
                ...env
            }
        })
        getSports.addMethod('GET', new LambdaIntegration(getSportsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        const location = api.root.addResource('location')

        /**
         * add location
         */
        const addLocation = location.addResource('addLocation')
        const addLocationLambda = new NodejsFunction(this, 'Add-Location',{
            ...lambdaProps,
            functionName: 'Add-Location',
            entry: path.join(__dirname, '../../src/lambdas/api/locations/addLocationHandler.ts'),
            environment: {
                ...env
            }
        })
        addLocation.addMethod('POST', new LambdaIntegration(addLocationLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * delete location
         */
        const deleteLocation = location.addResource('deleteLocation')
        const deleteLocationLambda = new NodejsFunction(this, 'Delete-Location',{
            ...lambdaProps,
            functionName: 'Delete-Location',
            entry: path.join(__dirname, '../../src/lambdas/api/locations/deleteLocationHandler.ts'),
            environment: {
                ...env
            }
        })
        deleteLocation.addMethod('DELETE', new LambdaIntegration(deleteLocationLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get locations
         */
        const getLocations = location.addResource('getLocations')
        const getLocationsLambda = new NodejsFunction(this, 'Get-Locations',{
            ...lambdaProps,
            functionName: 'Get-Locations',
            entry: path.join(__dirname, '../../src/lambdas/api/locations/getLocationsHandler.ts'),
            environment: {
                ...env
            }
        })
        getLocations.addMethod('GET', new LambdaIntegration(getLocationsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get location
         */
        const getLocation = location.addResource('getLocation')
        const getLocationLambda = new NodejsFunction(this, 'Get-Location',{
            ...lambdaProps,
            functionName: 'Get-Location',
            entry: path.join(__dirname, '../../src/lambdas/api/locations/getOneLocationHandler.ts'),
            environment: {
                ...env
            }
        })
        getLocation.addMethod('GET', new LambdaIntegration(getLocationLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        const like = api.root.addResource('like')

        /**
         * like post
         */
        const addLike = like.addResource('addLike')
        const addLikeLambda = new NodejsFunction(this, 'Add-Like',{
            ...lambdaProps,
            functionName: 'Add-Like',
            entry: path.join(__dirname, '../../src/lambdas/api/likes/addLikeHandler.ts'),
            environment: {
                ...env
            }
        })
        addLike.addMethod('GET', new LambdaIntegration(addLikeLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * check if liked post
         */
        const checkIfLiked = like.addResource('checkIfLiked')
        const checkIfLikedLambda = new NodejsFunction(this, 'Check-If-Liked',{
            ...lambdaProps,
            functionName: 'Check-If-Liked',
            entry: path.join(__dirname, '../../src/lambdas/api/likes/checkIfLikedHandler.ts'),
            environment: {
                ...env
            }
        })
        checkIfLiked.addMethod('GET', new LambdaIntegration(checkIfLikedLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get likes
         */
        const getLikes = like.addResource('getLikes')
        const getLikesLambda = new NodejsFunction(this, 'Get-Likes',{
            ...lambdaProps,
            functionName: 'Get-Likes',
            entry: path.join(__dirname, '../../src/lambdas/api/likes/getLikesHandler.ts'),
            environment: {
                ...env
            }
        })
        getLikes.addMethod('GET', new LambdaIntegration(getLikesLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * remove like
         */
        const removeLike = like.addResource('removeLike')
        const removeLikeLambda = new NodejsFunction(this, 'Remove-Like',{
            ...lambdaProps,
            functionName: 'Remove-Like',
            entry: path.join(__dirname, '../../src/lambdas/api/likes/removeLikeHandler.ts'),
            environment: {
                ...env
            }
        })
        removeLike.addMethod('GET', new LambdaIntegration(removeLikeLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        const follow = api.root.addResource('follow')
        
        /**
         * check if follows
         */
        const checkIfFollows = follow.addResource('checkIfFollows')
        const checkIfFollowsLambda = new NodejsFunction(this, 'Check-If-Follows',{
            ...lambdaProps,
            functionName: 'Check-If-Follows',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/checkIfFollowsHandler.ts'),
            environment: {
                ...env
            }
        })
        checkIfFollows.addMethod('GET', new LambdaIntegration(checkIfFollowsLambda))

        /**
         * follow user
         */
        const followUser = follow.addResource('followUser')
        const followUserLambda = new NodejsFunction(this, 'Follow-User',{
            ...lambdaProps,
            functionName: 'Follow-User',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/followHandler.ts'),
            environment: {
                ...env
            }
        })
        followUser.addMethod('GET', new LambdaIntegration(followUserLambda))

        /**
         * get followed 
         */
        const followedUsed = follow.addResource('followedUsed')
        const followedUsedLambda = new NodejsFunction(this, 'Followed-User',{
            ...lambdaProps,
            functionName: 'Followed-User',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/getFollowedHandler.ts'),
            environment: {
                ...env
            }
        })
        followedUsed.addMethod('GET', new LambdaIntegration(followedUsedLambda))

        /**
         * get someone followers 
         */
        const getSomeoneFollowers = follow.addResource('getSomeoneFollowers')
        const getSomeoneFollowersLambda = new NodejsFunction(this, 'Get-Someone-Followers', {
            ...lambdaProps,
            functionName: 'Get-Someone-Followers',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/getSomeoneFollowersHandler.ts'),
            environment: {
                ...env
            }
        })
        getSomeoneFollowers.addMethod('GET', new LambdaIntegration(getSomeoneFollowersLambda))

        /**
         * get your followers
         */
        const getYourFollowers = follow.addResource('getYourFollowers')
        const getYourFollowersLambda = new NodejsFunction(this, 'Get-Your-Followers',{
            ...lambdaProps,
            functionName: 'Get-Your-Followers',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/getYourFollowersHandler.ts'),
            environment: {
                ...env
            }
        })
        getYourFollowers.addMethod('GET', new LambdaIntegration(getYourFollowersLambda))

        
        this.apiUrl = api.url
    }
}