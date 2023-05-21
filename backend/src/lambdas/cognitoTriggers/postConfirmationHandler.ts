import { PostConfirmationTriggerHandler } from "aws-lambda";
import { connectDataBase } from "../../data/db/connection";
import { User } from "../../data/models/User";


export const handler: PostConfirmationTriggerHandler = async (event, context, callback) => {
    console.log(JSON.stringify(event))
    console.log(context)
    context.callbackWaitsForEmptyEventLoop = false;
    const cognitoId = event.request.userAttributes.sub;
    const username = event.userName
    const location = " "
    const bio = " "
    const prfilePicture = " "
    const date = Date.now()
    console.log(cognitoId, username, location, bio, prfilePicture, date)

    if(event.triggerSource === 'PostConfirmation_ConfirmSignUp'){
        try {
            await connectDataBase()
    
            const user = await User.findOne({ userCognitoId: cognitoId });
                User.init();
                const newUser = new User({
                    userCognitoId: cognitoId,
                    username: username,
                    location: location,
                    bio: bio,
                    prfilePicture: prfilePicture,
                    date: date
                });
                await newUser.save()

            callback(null, event)
        }
        catch (error) {
            console.log(error)
            callback(new Error('Something went wrong!'))
        }
    } else {
        callback(null, event)
    }
    callback(null, event)
}