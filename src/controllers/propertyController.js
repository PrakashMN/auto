const { getPropertyResponseById } = require("../services/propertyService");

const getProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    const property = await getPropertyResponseById(propertyId);

    if (!property) {
      return res.status(404).json({
        status: "error",
        message: "Property not found"
      });
    }

    return res.status(200).json({
      status: "success",
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      pdfLink: property.pdfLink
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProperty
};
