const mongoose = require("mongoose");

const processedMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    processed: {
      type: Boolean,
      required: true,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model("ProcessedMessage", processedMessageSchema);
