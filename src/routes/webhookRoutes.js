const express = require("express");
const Joi = require("joi");

const { handleWhatsAppWebhook } = require("../controllers/webhookController");
const validate = require("../middleware/validate");

const router = express.Router();

const whatsappWebhookSchema = Joi.object({
  message: Joi.string().trim().required(),
  from: Joi.string().trim().allow("").optional(),
  messageId: Joi.string().trim().required()
});

router.post("/whatsapp", validate(whatsappWebhookSchema), handleWhatsAppWebhook);

module.exports = router;
