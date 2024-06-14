import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    history: {
      type:Date,
      default:Date.now
    },
    token:{
      type:String
    },
},{timestamps:true});

const User = mongoose.model("User", userModel);

export default User;
