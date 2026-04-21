require("dotenv").config();

const connectDB = require("../config/db");
const Property = require("../models/Property");

const sampleProperties = [
  {
    propertyId: "P101",
    title: "Modern Family Apartment",
    location: "Lekki, Lagos",
    price: "$120,000",
    bedrooms: 3,
    pdfLink: "https://example.com/pdfs/p101.pdf"
  },
  {
    propertyId: "P102",
    title: "Luxury Waterfront Duplex",
    location: "Victoria Island, Lagos",
    price: "$250,000",
    bedrooms: 4,
    pdfLink: "https://example.com/pdfs/p102.pdf"
  },
  {
    propertyId: "P103",
    title: "Cozy City Studio",
    location: "Ikeja, Lagos",
    price: "$75,000",
    bedrooms: 1,
    pdfLink: "https://example.com/pdfs/p103.pdf"
  }
];

const seedProperties = async () => {
  try {
    await connectDB();

    for (const property of sampleProperties) {
      await Property.updateOne(
        { propertyId: property.propertyId },
        { $set: property },
        { upsert: true }
      );
    }

    console.log("Sample properties seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed properties:", error.message);
    process.exit(1);
  }
};

seedProperties();
