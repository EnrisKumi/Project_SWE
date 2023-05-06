import { Construct } from 'constructs'
import { config } from 'dotenv'

interface ContextOutput {
  env: {
    AWS_CDK_REGION: string
    STAGE: string
    DYNAMO_DB_TABLE_NAME: string
    USER_POOL_ID: string
  }
  account: string
}

export const getContext = (scope: Construct): ContextOutput => {
  const stage = process.env.STAGE ?? 'sandbox'
  if (!stage) throw new Error('Deployment stage not found')
  const context = scope?.node.tryGetContext(stage) || {}
  const path = stage === 'dev' ? '.env' : '.env'
  context.env = config({ path }).parsed ?? {}
  return context
}
