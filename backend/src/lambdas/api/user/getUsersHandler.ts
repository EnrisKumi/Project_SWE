// const connectToDatabase = require('../../database/db');
// const User = require('../../models/User');


module.exports.getUsers = async (event: any, callback: any, context: any) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        // await connectToDatabase();
        // const users = await User.find();
        // if (!users) {
        //     callback(null, (404, 'No Users Found.'));
        // }

        callback(null, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Allow": "GET, OPTIONS, POST",
                "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
                "Access-Control-Allow-Headers": "*"
            },
            statusCode: 200,
            body: JSON.stringify('users'),
        });
    } catch (error) {
        return(error);
    }
};