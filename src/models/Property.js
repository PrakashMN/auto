const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  title: String,
  location: String,
  price: String,
  bedrooms: Number,
  pdfLink: String
});

// 🔥 IMPORTANT: force collection name = "property"
module.exports = mongoose.model("Property", propertySchema);