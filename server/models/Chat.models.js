import mongoose, { Schema, model, Types } from "mongoose";

const Chatschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: Types.ObjectId,
      ref: "ChatUser",
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "ChatUser",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Chat=mongoose.model("Chat",Chatschema);
export default Chat;
