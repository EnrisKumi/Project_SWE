import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({

    commentCognitoId:{
        type:String,
    },
    userName: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String,
        required: true
    }
})

const Comment = mongoose.model('Comment', commentSchema);
