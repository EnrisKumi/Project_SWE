import mongoose from "mongoose";

const sportsSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: true,
  },
});

const SportsTag = mongoose.model("SportsTag", sportsSchema);
