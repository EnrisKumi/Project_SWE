import { Stack, StackProps } from "aws-cdk-lib"
import { Cors, RestApi } from "aws-cdk-lib/aws-apigateway"
import { Construct } from "constructs"

export interface ApiStackProps extends StackProps {

}

export class ApiStack extends Stack {
    apiUrl: String
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        const api = new RestApi(this, 'SocialMedia-API',{
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        })

        this.apiUrl = api.url
    }
}