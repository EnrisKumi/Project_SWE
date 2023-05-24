import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema(
  {
    postCognitoId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "LocationTag",
      },
      {
        type: Schema.Types.ObjectId,
        ref: "SportsTag",
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
    startTime: {
      type: String,
      //required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    joined: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    // history: [
    //   {
    //     date: { type: Date, default: Date.now() },
    //     userId: { type: Schema.Types.ObjectId, ref: User },
    //   },
    // ],
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", PostSchema);

