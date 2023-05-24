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

const locationSchema = new mongoose.Schema({
  text: {
    type:String,
    unique: true,
  },
})

const sportsSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: true,
  },
});


const User = mongoose.model("User", UserSchema)
const Post = mongoose.model("Post", PostSchema);
const Comment = mongoose.model('Comment', commentSchema);
const LocationTag = mongoose.model('LocationTag', locationSchema);
const SportsTag = mongoose.model("SportsTag", sportsSchema);

export { User, Post, Comment, LocationTag, SportsTag }