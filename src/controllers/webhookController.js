const propertyService = require("../services/propertyService");

// 🔐 VERIFY WEBHOOK (Meta requirement)
const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = "myverifytoken123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verification failed");
    return res.sendStatus(403);
  }
};

// 📩 HANDLE INCOMING MESSAGE
const handleIncomingMessage = async (req, res) => {
  try {
    console.log("📩 Incoming:", JSON.stringify(req.body, null, 2));

    // Meta sends nested structure
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages?.[0];

    if (!messages) {
      return res.sendStatus(200);
    }

    const userMsg = messages.text?.body?.trim().toLowerCase();
    const from = messages.from;

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

    return res.json({
      text: "❓ Send 'hi' or a Property ID like P101."
    });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.sendStatus(500);
  }
};

// 🧪 DEBUG ROUTE
const debugDb = async (req, res) => {
  const Property = require("../models/Property");
  const data = await Property.find();

  return res.json({
    count: data.length,
    data
  });
};

module.exports = {
  handleIncomingMessage,
  verifyWebhook,
  debugDb
};