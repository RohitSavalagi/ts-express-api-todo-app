import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Please enter a user name"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
});

export const User = mongoose.model("User", UserSchema);
