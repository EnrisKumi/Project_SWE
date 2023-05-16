import { APIGatewayProxyHandler } from "aws-lambda";
import { parseGwEvent } from "../../../../lib/utils/parseGwEvent";
import { User } from "../../../data/db/entities/User";
import { gwResponse } from "../../../../lib/utils/gwResponse";
import { gwError } from "../../../../lib/utils/gwError";

export const handler: APIGatewayProxyHandler = async (event) => {
    const {body, claims} = parseGwEvent(event)

    try {

        const userInstance = new User({
            id: claims.sub,
            location: body.location,
            bio: body.bio
        })

        const userUpdateReponse = await userInstance.update({})
        if(!userUpdateReponse) { throw new Error('Error in update')}

        return gwResponse(userUpdateReponse)
    } catch (error) {
        return gwError(error)
    }
}