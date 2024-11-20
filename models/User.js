import mongoose, { models, Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },

    image: String,
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
