import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface CICDStackProps extends StackProps {

}

export class CICDStack extends Stack {
    constructor(scope: Construct, id: string, props: CICDStackProps){
        super(scope,id,props)


    }
}