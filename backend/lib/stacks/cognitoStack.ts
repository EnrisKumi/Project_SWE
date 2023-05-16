import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AccountRecovery, UserPool, UserPoolOperation, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { lambdaProps } from "../utils/lambdaProps";
import { Policy, PolicyDocument } from "aws-cdk-lib/aws-iam";
import path = require("path");
import { getContext } from "../utils/context";

export interface CognitoStackProps extends StackProps{
    mainTable: Table
}

export class CognitoStack extends Stack{
    public readonly userPool: UserPool;
    constructor(scope: Construct, id: string, props: CognitoStackProps){
        super(scope, id, props)

        const context = getContext(this)
        const { env } = context

        const userPool = new UserPool(this, 'CognitoUserPool', {
            userPoolName: 'CognitoUserPool',
            selfSignUpEnabled: true,
            signInCaseSensitive: true,
            signInAliases: {
                username: true,
                email: true
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true
                }
            },
            userVerification: {
                emailStyle: VerificationEmailStyle.CODE
            },
            autoVerify: {
                email: true
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            removalPolicy: RemovalPolicy.DESTROY
        })

        userPool.addClient('cognito-client',{
            userPoolClientName: 'cognito-client',
            authFlows: {
                adminUserPassword: true,
                userPassword: true,
                userSrp: true
            },
            generateSecret: false,
            refreshTokenValidity: Duration.days(1),
            preventUserExistenceErrors: true
        })

        const userPoolArn = userPool.userPoolArn
        
        // const lambdaPreSignUpTrigger = new NodejsFunction(this, 'Cognito-PreSignUpTrigger',{
        //     ...lambdaProps,
        //     functionName: 'Cognito-PreSignUpTrigger',
        //     entry: path.join(__dirname, '../../src/lambdas/cognitoTriggers/preSingUpHandler.ts')
        // })

        // lambdaPreSignUpTrigger.role?.attachInlinePolicy(new Policy(this, 'userPoolPolicy', {
        //     document: PolicyDocument.fromJson({
        //       Version: '2012-10-17',
        //       Statement: [
        //         {
        //           Sid: 'VisualEditor0',
        //           Effect: 'Allow',
        //           Action: 'cognito-idp:*',
        //           Resource: userPoolArn
        //         }
        //       ]
        //     })
        //   }))

        //   userPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, lambdaPreSignUpTrigger)

          const lambdaPostConfirmTrigger = new NodejsFunction(this, 'Cognito-PostConfirmTrigger', {
            ...lambdaProps,
            functionName: 'Cognito-PostConfirmTrigger',
            environment: {
              ...env
            },
            entry: path.join(__dirname, '../../src/lambdas/cognitoTriggers/postConfirmationHandler.ts')
          })

          props.mainTable.grantReadWriteData(lambdaPostConfirmTrigger)

          userPool.addTrigger(UserPoolOperation.POST_CONFIRMATION, lambdaPostConfirmTrigger)

        this.userPool = userPool
    }
}