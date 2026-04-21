const Property = require("../models/Property");

const normalizePropertyId = (propertyId) => {
  if (typeof propertyId !== "string") return "";
  return propertyId.trim().toUpperCase();
};

const findPropertyById = async (propertyId) => {
  try {
    const normalizedPropertyId = normalizePropertyId(propertyId);

    console.log("🔍 Searching for:", normalizedPropertyId);

    const all = await Property.find();
    console.log("📦 ALL DATA FROM DB:", all);

    if (!normalizedPropertyId) return null;

    return await Property.findOne({ propertyId: normalizedPropertyId }).lean();
  } catch (error) {
    console.error("❌ DB ERROR:", error);
    throw error;
  }
};

const getPropertyResponseById = async (propertyId) => {
  const property = await findPropertyById(propertyId);
  if (!property) return null;

  return {
    title: property.title,
    location: property.location,
    price: property.price,
    bedrooms: property.bedrooms,
    pdfLink: property.pdfLink
  };
};

module.exports = {
  findPropertyById,
  getPropertyResponseById,
  normalizePropertyId
};