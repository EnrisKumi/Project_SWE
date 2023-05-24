import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    userCognitoId: {
      type: String,
    },
    username: {
      type: String,
      /*required: true,*/
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },

    prfilePicture: {
      type: String,
    },
    followed: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
);

const User = mongoose.model("User", UserSchema)
