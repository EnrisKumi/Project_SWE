import { connectDataBase } from "../../../data/db/connection";
import { User } from "../../../data/models/modelsConfig";

export const handler = async (event: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const cognitoId = event.queryStringParameters.cognitoId;

    try {
        await connectDataBase()
        console.log(cognitoId);

        const user = await User.findOne({ userCognitoId: cognitoId });

        if (user) {
            console.log("!!!!!!!!!!!!!!!!!!!!! EXISTS !!!!!!!!!!!!!!!!!!!!!!!!!!")
        } else {
            const { username, location, bio, prfilePicture, date } = JSON.parse(event.body); //if user dosent exist
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