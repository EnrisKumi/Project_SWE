import { connectDataBase } from "../../data/db/connection";
import { User } from "../../data/models/User";


export const handler = async (event: any, context: any) => {
    console.log(event)
    context.callbackWaitsForEmptyEventLoop = false;
    const cognitoId = event.request.userAttributes.sub;
    const username = event.userName
    const location = " "
    const bio = " "
    const prfilePicture = " "
    const date = Date.now()
    console.log(cognitoId, username, location, bio, prfilePicture, date)

    try {
        await connectDataBase()

        const user = await User.findOne({ userCognitoId: cognitoId });

        if (user) {
            console.log("!!!!!!!!!!!!!!!!!!!!! EXISTS !!!!!!!!!!!!!!!!!!!!!!!!!!")
        } else {
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


            return {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Allow": "GET, OPTIONS, POST",
                    "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
                    "Access-Control-Allow-Headers": "*"
                },
                statusCode: 200,
                body: JSON.stringify(newUser),
            };
        }
    }
    catch (error) {
        console.log(error)
        return (error);
    }
}