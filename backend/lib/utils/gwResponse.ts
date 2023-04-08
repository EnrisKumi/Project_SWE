import { APIGatewayProxyResult } from "aws-lambda"

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*'
}

export const gwResponse = (data: object, statusCode: 200 | 400 | 500 = 200) => {
  const body = { success: statusCode === 200, data }
  const gwResponse = { body, statusCode }
  process.env.AWS_EXECUTION_ENV ? console.log(JSON.stringify({ gwResponse })) : console.log(gwResponse)
  const gwProxyResponse: APIGatewayProxyResult = { ...gwResponse, body: JSON.stringify(body), headers }
  return gwProxyResponse
}
