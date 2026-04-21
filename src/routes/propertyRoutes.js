const express = require("express");
const Joi = require("joi");

const { getProperty } = require("../controllers/propertyController");
const validate = require("../middleware/validate");

const router = express.Router();

const propertyLookupSchema = Joi.object({
  propertyId: Joi.string().trim().required()
});

router.post("/get", validate(propertyLookupSchema), getProperty);

module.exports = router;
