const propertyService = require("../services/propertyService");

exports.handleIncomingMessage = async (req, res, next) => {
  try {
    const { message, from, messageId } = req.body;

    // ✅ Validation
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

    // 🟢 1. Greeting
    if (["hi", "hello", "hey"].includes(userMsg)) {
      return res.json({
        text: "Hello 👋\nSend me a Property ID like P101 to get details."
      });
    }

    // 🟢 2. Property ID handling
    const isPropertyId = /^p\d+$/i.test(userMsg);

    if (isPropertyId) {
      const propertyId = userMsg.toUpperCase();

      // ✅ FIXED: using correct function
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

    // 🟢 3. Default fallback
    return res.json({
      text: "❓ I didn't understand that.\nSend 'hi' or a Property ID like P101."
    });

  } catch (error) {
    console.error("Webhook Error:", error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};