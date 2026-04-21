const Property = require("../models/Property");

const normalizePropertyId = (propertyId) => {
  if (typeof propertyId !== "string") return "";
  return propertyId.trim().toUpperCase();
};

const findPropertyById = async (propertyId) => {
  try {
    const normalizedPropertyId = normalizePropertyId(propertyId);
    if (!normalizedPropertyId) return null;

    return await Property.findOne({ propertyId: normalizedPropertyId }).lean();
  } catch (error) {
    error.statusCode = 500;
    error.publicMessage = "Unable to fetch property";
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