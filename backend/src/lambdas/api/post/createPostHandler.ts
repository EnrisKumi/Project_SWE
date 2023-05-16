import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { Post } from "../../../data/db/entities/Post";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";


export const handler:APIGatewayProxyHandler =async (event, context, callback) => {
    //const {body, identity} = parseGwEvent(event)
    const {body, claims} = parseGwEvent(event)

    try {

        const generatedId = uuidv4()
        const date = new Date()
        const startTime: string = body?.startTime
        const startTimeISo = new Date(startTime)
        const tags: string[] = body?.tags
        const limit: number = body?.limit
        const description: string = body?.text
        const location: string = body?.location
        const type = 'Post'

        const username = claims['cognito:username']
        
        let status

        if((date.getTime() - startTimeISo.getTime()) > 0){
            status = 'Not Started'
        } else {
            status = 'Completed'
        }

        console.log(username, description, status, tags, startTime, limit )

        const postInstance = new Post({
            sub: claims?.sub,
            username: username,
            description: description,
            status: status,
            tags: tags,
            date: date.toISOString(),
            startTime: startTime,
            limit: limit,
            location: location,
        })

        await postInstance.save()

        return gwResponse(body)
    } catch (error) {
        return gwError(error)
    }
}