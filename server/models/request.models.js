
import mongoose, { Schema, model, Types } from "mongoose";

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },

    sender: {
      type: Types.ObjectId,
      ref: "ChatUser",
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      ref: "ChatUser",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", schema);

export default Request;