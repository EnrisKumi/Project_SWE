import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AccountRecovery, UserPool, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export interface CognitoStackProps extends StackProps{

}

export class CognitoStack extends Stack{
    constructor(scope: Construct, id: string, props: CognitoStackProps){
        super(scope, id, props)

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

    }
}