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


        const post = api.root.addResource('post')

        /**
         * create post at user
         */
        const createPostAtUser = post.addResource('createPostAtUser')
        const createPostAtUserLambda = new NodejsFunction(this, 'Create-Post-At-User',{
            ...lambdaProps,
            functionName: 'Create-Post-At-User',
            entry: path.join(__dirname, '../../src/lambdas/api/post/createPostAtUserHandler.ts'),
            environment: {
                ...env
            }
        })
        createPostAtUser.addMethod('POST', new LambdaIntegration(createPostAtUserLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * delete post by user id
         */
        const deletePostByUserId = post.addResource('deletePostByUserId')
        const deletePostByUserIdLambda = new NodejsFunction(this, 'Delete-Post-By-User-Id',{
            ...lambdaProps,
            functionName: 'Delete-Post-By-User-Id',
            entry: path.join(__dirname, '../../src/lambdas/api/post/deletePostByUserIdHandler.ts'),
            environment: {
                ...env
            }
        })
        deletePostByUserId.addMethod('DELETE', new LambdaIntegration(deletePostByUserIdLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get all posts
         */
        const getAllPosts = post.addResource('getAllPosts')
        const getAllPostsLambda = new NodejsFunction(this, 'Get-All-Posts',{
            ...lambdaProps,
            functionName: 'Get-All-Posts',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getAllPostsHandler.ts'),
            environment: {
                ...env
            } 
        })
        getAllPosts.addMethod('GET', new LambdaIntegration(getAllPostsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get one post
         */
        const getOnePost = post.addResource('getOnePost')
        const getOnePostLambda = new NodejsFunction(this, 'Get-One-Post',{
            ...lambdaProps,
            functionName: 'Get-One-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getOnePostHandler.ts'),
            environment: {
                ...env
            } 
        })
        getOnePost.addMethod('GET', new LambdaIntegration(getOnePostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get pages for location sport
         */
        const getPagesForLocationSport = post.addResource('getPagesForLocationSport')
        const getPagesForLocationSportLambda = new NodejsFunction(this, 'Get-Pages-For-Location-Sport',{
            ...lambdaProps,
            functionName: 'Get-Pages-For-Location-Sport',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPagesForLocationSportsHandler.ts'),
            environment: {
                ...env
            } 
        })
        getPagesForLocationSport.addMethod('GET', new LambdaIntegration(getPagesForLocationSportLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get pages for tags
         */
        const getPagesForTags = post.addResource('getPagesForTags')
        const getPagesForTagsLambda = new NodejsFunction(this, 'Get-Pages-For-Tags',{
            ...lambdaProps,
            functionName: 'Get-Pages-For-Tags',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPagesForTagsHandler.ts'),
            environment: {
                ...env
            } 
        })
        getPagesForTags.addMethod('GET', new LambdaIntegration(getPagesForTagsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get post by location or sport
         */
        const getPostByLocationOrSport = post.addResource('getPostByLocationOrSport')
        const getPostByLocationOrSportLambda = new NodejsFunction(this, 'Get-Post-By-Location-Or-Sport',{
            ...lambdaProps,
            functionName: 'Get-Post-By-Location-Or-Sport',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPostByLocationOrSportHandler.ts'),
            environment: {
                ...env
            } 
        })
        getPostByLocationOrSport.addMethod('GET', new LambdaIntegration(getPostByLocationOrSportLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get post by user id
         */
        const getPostsByUserId = post.addResource('getPostsByUserId')
        const getPostsByUserIdLambda= new NodejsFunction(this, 'Get-Posts-By-User-Id',{
            ...lambdaProps,
            functionName: 'Get-Posts-By-User-Id',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPostByUserIdHandler.ts'),
            environment: {
                ...env
            } 
        })
        getPostsByUserId.addMethod('GET', new LambdaIntegration(getPostsByUserIdLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get joined post
         */
        const getPostJoined = post.addResource('getPostJoined')
        const getPostJoinedLambda = new NodejsFunction(this, 'Get-Post-Joined',{
            ...lambdaProps,
            functionName: 'Get-Post-Joined',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getpostJoinedHandler.ts'),
            environment: {
                ...env
            } 
        })
        getPostJoined.addMethod('GET', new LambdaIntegration(getPostJoinedLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get post pages
         */
        const getPostPages = post.addResource('getPostPages')
        const getPostPagesLambda = new NodejsFunction(this, 'Get-Post-Pages',{
            ...lambdaProps,
            functionName: 'Get-Post-Pages',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPostPagesHandler.ts'),
            environment: {
                ...env
            }  
        }) 
        getPostPages.addMethod('GET', new LambdaIntegration(getPostPagesLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get posts by tags
         */
        const getPostsByTag = post.addResource('getPostsByTag')
        const getPostsByTagLambda = new NodejsFunction(this, 'Get-Posts-By-Tag',{
            ...lambdaProps,
            functionName: 'Get-Posts-By-Tag',
            entry: path.join(__dirname, '../../src/lambdas/api/post/getPostsByTagHandler.ts'),
            environment: {
                ...env
            }  
        })
        getPostsByTag.addMethod('GET', new LambdaIntegration(getPostsByTagLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * update post
         */
        const updatePost = post.addResource('updatePost')
        const updatePostLambda = new NodejsFunction(this, 'Update-Post',{
            ...lambdaProps,
            functionName: 'Update-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/post/updatePostHandler.ts'),
            environment: {
                ...env
            }  
        })
        updatePost.addMethod('PATCH', new LambdaIntegration(updatePostLambda),{
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
        checkIfFollows.addMethod('GET', new LambdaIntegration(checkIfFollowsLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

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
        followUser.addMethod('GET', new LambdaIntegration(followUserLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

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
        followedUsed.addMethod('GET', new LambdaIntegration(followedUsedLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

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
        getSomeoneFollowers.addMethod('GET', new LambdaIntegration(getSomeoneFollowersLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

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
        getYourFollowers.addMethod('GET', new LambdaIntegration(getYourFollowersLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        /**
         * unfollow
         */
        const unfollow = follow.addResource('unfollow')
        const unfollowLambda = new NodejsFunction(this, 'Unfollow',{
            ...lambdaProps,
            functionName: 'Unfollow',
            entry: path.join(__dirname, '../../src/lambdas/api/follow/unfollowHandler.ts'),
            environment: {
                ...env
            } 
        })
        unfollow.addMethod('GET', new LambdaIntegration(unfollowLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        const join = api.root.addResource('join')

        /**
         * check joined post
         */
        const checkJoinedPost = join.addResource('checkJoinedPost')
        const checkJoinedPostLambda = new NodejsFunction(this, 'Check-Joined-Post',{
            ...lambdaProps,
            functionName: 'Check-Joined-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/checkJoinedPostHandler.ts'),
            environment: {
                ...env
            }
        })
        checkJoinedPost.addMethod('GET', new LambdaIntegration(checkJoinedPostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * get joined users
         */
        const getJoinedUsers = join.addResource('getJoinedUsers')
        const getJoinedUsersLambda = new NodejsFunction(this, 'Get-Joined-Users',{
            ...lambdaProps,
            functionName: 'Get-Joined-Users',
            entry: path.join(__dirname, '../../src/lambdas/api/getJoinedUsersHandler.ts'),
            environment: {
                ...env
            }
        })
        getJoinedUsers.addMethod('GET', new LambdaIntegration(getJoinedUsersLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * join post
         */
        const joinPost = join.addResource('joinPost')
        const joinPostLambda = new NodejsFunction(this, 'Join-Post',{
            ...lambdaProps,
            functionName: 'Join-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/joinPostHandler.ts'),
            environment: {
                ...env
            }
        })
        joinPost.addMethod('GET', new LambdaIntegration(joinPostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })

        /**
         * leave post
         */
        const leavePost = join.addResource('leavePost')
        const leavePostLambda = new NodejsFunction(this, 'Leave-Post',{
            ...lambdaProps,
            functionName: 'Leave-Post',
            entry: path.join(__dirname, '../../src/lambdas/api/leavePostHandler.ts'),
            environment: {
                ...env
            }
        })
        leavePost.addMethod('GET', new LambdaIntegration(leavePostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })


        /**
         * search handler
         */
        const search = api.root.addResource('search')
        const searchPostLambda = new NodejsFunction(this, 'Search',{
            ...lambdaProps,
            functionName: 'Search',
            entry: path.join(__dirname, '../../src/lambdas/api/searchHandler.ts'),
            environment: {
                ...env
            }
        })
        search.addMethod('GET', new LambdaIntegration(searchPostLambda),{
            authorizer: auth,
            authorizationType: AuthorizationType.COGNITO
        })
        
        this.apiUrl = api.url
    }
}