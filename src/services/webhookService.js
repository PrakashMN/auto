const ProcessedMessage = require("../models/ProcessedMessage");
const {
  findPropertyById,
  normalizePropertyId
} = require("./propertyService");
const logger = require("../utils/logger");

const hasProcessedMessage = async (messageId) => {
  try {
    const existingMessage = await ProcessedMessage.findOne({
      messageId: messageId.trim()
    }).lean();

    return Boolean(existingMessage);
  } catch (error) {
    error.statusCode = 500;
    error.publicMessage = "Unable to verify message status";
    throw error;
  }
};

const markMessageAsProcessed = async (messageId) => {
  try {
    return await ProcessedMessage.create({
      messageId: messageId.trim(),
      processed: true
    });
  } catch (error) {
    error.statusCode = error.code === 11000 ? 200 : 500;
    error.publicMessage =
      error.code === 11000
        ? "Duplicate message"
        : "Unable to store processed message";
    throw error;
  }
};

const buildWebhookResponse = async ({ message, from, messageId }) => {
  const propertyId = normalizePropertyId(message);
  const property = await findPropertyById(propertyId);

  logger.info("Processing WhatsApp webhook", {
    from,
    messageId,
    propertyId
  });

  if (!property) {
    logger.info("Property not found for webhook message", {
      from,
      messageId,
      propertyId
    });

    return {
      text: "\u274C Property not found"
    };
  }

  logger.info("Property found for webhook message", {
    from,
    messageId,
    propertyId
  });

  return {
    text: `\uD83C\uDFE0 ${property.title}\n\uD83D\uDCCD ${property.location}\n\uD83D\uDCB0 ${property.price}`,
    document: {
      url: property.pdfLink,
      filename: `${property.propertyId}.pdf`
    }
  };
};

module.exports = {
  hasProcessedMessage,
  markMessageAsProcessed,
  buildWebhookResponse
};
