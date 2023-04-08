import { Duration } from 'aws-cdk-lib'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'

export const lambdaProps: NodejsFunctionProps = {
  memorySize: 1024,
  runtime: Runtime.NODEJS_16_X,
  architecture: Architecture.ARM_64,
  timeout: Duration.seconds(30),
  bundling: { externalModules: ['aws-sdk'] }
}
