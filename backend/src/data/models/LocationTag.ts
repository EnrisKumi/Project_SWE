import mongoose from "mongoose";
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
    text: {
      type:String,
      unique: true,
    },
})

const LocationTag = mongoose.model('LocationTag', locationSchema);
