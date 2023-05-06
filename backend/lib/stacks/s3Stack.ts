import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { Bucket } from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

export interface S3StackProps extends StackProps{

}

export class S3Stack extends Stack {
    userProfileBucket: Bucket
    constructor(scope: Construct, id: string, props: S3StackProps){
        super(scope, id, props)

        const userProfileBucket = new Bucket(this, 'UserImagesBucket',{
            bucketName: 'user.images.bucket',
            removalPolicy: RemovalPolicy.DESTROY,
            publicReadAccess: true
        })

        this.userProfileBucket = userProfileBucket

    }
}