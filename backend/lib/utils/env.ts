import { config } from 'dotenv'

export const getDeploymentEnv = () => {
  const stage = process.env.STAGE
  const path = stage 
  config({ path })
  const accountId = process.env.CDK_DEFAULT_ACCOUNT
  const region = process.env.AWS_CDK_REGION
  console.log(`AccountId: ${accountId} `)
  console.log(`Region: ${region} `)
  return { account: accountId, region }
}
