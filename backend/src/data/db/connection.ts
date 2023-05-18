import mongoose from "mongoose";
import { getEnv } from "../../../lib/utils/getEnv";

mongoose.Promise = global.Promise;

const env = getEnv()

export const connectDataBase = async () => {
    try {
        const DB_USER = 'memories';
        if(!env.DYNAMO_DB_PASSWORD){ throw new Error('DYNAMO_DB_PASSWORD missing')}
        const password:string = env.DYNAMO_DB_PASSWORD
        const PASSWORD = encodeURIComponent(env.DYNAMO_DB_PASSWORD);

        const urlAtlas = `mongodb+srv://${DB_USER}:${PASSWORD}@hobbies.xqzaqqu.mongodb.net/?retryWrites=true&w=majority`;
        mongoose.connect(urlAtlas);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};