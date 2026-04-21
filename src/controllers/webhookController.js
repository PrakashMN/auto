const propertyService = require("../services/propertyService");

const handleIncomingMessage = async (req, res) => {
  try {
    const { message, messageId } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({
        status: "error",
        message: '"message" is required'
      });
    }

    if (!messageId) {
      return res.status(400).json({
        status: "error",
        message: '"messageId" is required'
      });
    }

    const userMsg = message.trim().toLowerCase();

    // Greeting
    if (["hi", "hello", "hey"].includes(userMsg)) {
      return res.json({
        text: "Hello 👋\nSend me a Property ID like P101 to get details."
      });
    }

    // Property ID detection
    const isPropertyId = /^p\d+$/i.test(userMsg);

    if (isPropertyId) {
      const propertyId = userMsg.toUpperCase();

      const property = await propertyService.getPropertyResponseById(propertyId);

      if (!property) {
        return res.json({
          text: "❌ Property not found. Please check the ID."
        });
      }

      return res.json({
        text: `🏠 ${property.title}\n📍 ${property.location}\n💰 ${property.price}\n🛏 ${property.bedrooms} BHK`,
        document: {
          url: property.pdfLink,
          filename: `${propertyId}.pdf`
        }
      });
    }

    // Default fallback
    return res.json({
      text: "❓ Send 'hi' or a Property ID like P101."
    });

  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

module.exports = { handleIncomingMessage };