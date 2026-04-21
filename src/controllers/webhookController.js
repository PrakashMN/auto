const propertyService = require('../services/propertyService');

const handleWhatsAppWebhook = async (req, res, next) => {
  try {
    const { message, from } = req.body;

    if (!message) {
      return res.json({ text: "Invalid request" });
    }

    const userMsg = message.trim().toLowerCase();

    // 🟢 1. Greeting
    if (["hi", "hello", "hey"].includes(userMsg)) {
      return res.json({
        text: "Hello 👋\nSend me a Property ID like P101 to get details."
      });
    }

    // 🟢 2. Property ID Handling
    const isPropertyId = /^p\d{1,5}$/i.test(userMsg);

    if (isPropertyId) {
      const propertyId = userMsg.toUpperCase();

      const property = await propertyService.getPropertyById(propertyId);

      if (!property) {
        return res.json({
          text: "❌ Property not found. Please check the ID."
        });
      }

      return res.json({
        text: `${property.title}\n${property.location}\n${property.price}\n${property.bedrooms} BHK`,
        document: {
          url: property.pdfLink,
          filename: `${property.propertyId}.pdf`
        }
      });
    }

    // 🔁 3. Fallback
    return res.json({
      text: "Send 'hi' or a valid Property ID like P101"
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleWhatsAppWebhook
};