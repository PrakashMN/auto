const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: String,
      required: true,
      trim: true
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0
    },
    pdfLink: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model("Property", propertySchema);
