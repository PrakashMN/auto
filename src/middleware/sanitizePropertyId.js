const sanitizePropertyId = (req, res, next) => {
  const propertyId = req.body?.propertyId;

  if (typeof propertyId === "string") {
    req.sanitizedPropertyId = propertyId.replace(/\s+/g, "").toUpperCase();
  } else {
    req.sanitizedPropertyId = "";
  }

  next();
};

module.exports = sanitizePropertyId;
