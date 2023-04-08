export const parseGwEvent = (event: any) => {
    try {
      const parsedBody = JSON.parse(event.body)
      event.body = event.body ? parsedBody : event.body
    } catch {}
    console.log(process.env.AWS_EXECUTION_ENV ? JSON.stringify({ event }) : event)
    const parsedEvent: { body: any, [key: string]: any } = {
      token: event.headers?.authorization ?? event.headers?.Authorization,
      httpMethod: event.requestContext?.http?.method || event.httpMethod,
      claims: event.requestContext?.authorizer?.claims,
      body: event.body || {},
      queryStringParameters: event.queryStringParameters,
      pathParameters: event.pathParameters
    }
    return parsedEvent
  }
  