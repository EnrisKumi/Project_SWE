import { APIGatewayProxyResult } from 'aws-lambda'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*'
}

interface CustomError {
  name: string
  message: string
}

export class ClientError extends Error {
  details: object
  readonly clientError: boolean
  constructor (error: CustomError, details?: object) {
    super(error.message)
    this.name = error.name
    this.clientError = true
    this.details = details ?? {}
  }
}

export const logError = (error: any) => {
  if (process.env.AWS_EXECUTION_ENV) {
    console.log(JSON.stringify({
      errorType: error?.name,
      errorMessage: error?.message,
      stack: error.stack.split('\n'),
      ...error
    }))
  } else {
    console.log({
      errorType: error?.name,
      errorMessage: error?.message,
      stack: error.stack.split('\n'),
      ...error
    })
  }
}

export const errorWarper = (error: any): Error => {
  if (error?.clientError) {
    return error
  } else {
    logError(error)
    return new Error('Somthing went wrong!')
  }
}

export const gwError = (error: any) => {
  const body = {
    success: false,
    error: { name: 'GeneralError', message: 'Somthing went wrong!', details: {} }
  }
  let statusCode
  if (error?.clientError) {
    body.error = { message: error.message, name: error.name, details: error?.details }
    statusCode = 400
  } else {
    statusCode = 500
  }
  logError(error)
  const gwProxyResponse: APIGatewayProxyResult = { statusCode, body: JSON.stringify(body), headers }
  return gwProxyResponse
}
