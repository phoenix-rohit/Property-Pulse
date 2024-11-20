import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: String,
    body: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
