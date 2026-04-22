const axios = require("axios");
const propertyService = require("../services/propertyService");

// 🔐 VERIFY WEBHOOK
const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed");
    return res.sendStatus(403);
  }
};

// 📩 HANDLE INCOMING MESSAGE
const handleIncomingMessage = async (req, res) => {
  try {
    console.log("📩 Incoming:", JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // ❌ No message → ignore
    if (!message) return res.sendStatus(200);

    const from = message.from;

    // ✅ Safe text extraction
    const userMsg = message.text?.body?.trim()?.toLowerCase();
    if (!userMsg) return res.sendStatus(200);

    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

    // 🔹 Greeting
    if (["hi", "hello", "hey"].includes(userMsg)) {
      await sendText(
        from,
        "Hello 👋\nSend me a Property ID like P101.",
        PHONE_NUMBER_ID,
        ACCESS_TOKEN
      );
      return res.sendStatus(200);
    }

    // 🔹 Property ID check
    const isPropertyId = /^p\d+$/i.test(userMsg);

    if (isPropertyId) {
      const propertyId = userMsg.toUpperCase();

      const property =
        await propertyService.getPropertyResponseById(propertyId);

      if (!property) {
        await sendText(
          from,
          "❌ Property not found. Please check the ID.",
          PHONE_NUMBER_ID,
          ACCESS_TOKEN
        );
        return res.sendStatus(200);
      }

      await sendDocument(
        from,
        property,
        propertyId,
        PHONE_NUMBER_ID,
        ACCESS_TOKEN
      );

      return res.sendStatus(200);
    }

    // 🔹 Default reply
    await sendText(
      from,
      "❓ Send 'hi' or a Property ID like P101.",
      PHONE_NUMBER_ID,
      ACCESS_TOKEN
    );

    return res.sendStatus(200);
  } catch (error) {
    console.error(
      "❌ Webhook Error:",
      error.response?.data || error.message
    );
    return res.sendStatus(500);
  }
};

// 📤 SEND TEXT MESSAGE
const sendText = async (to, text, phoneId, token) => {
  await axios.post(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// 📤 SEND DOCUMENT MESSAGE
const sendDocument = async (to, property, propertyId, phoneId, token) => {
  await axios.post(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "document",
      document: {
        link: property.pdfLink,
        filename: `${propertyId}.pdf`,
        caption: `🏠 ${property.title}
📍 ${property.location}
💰 ${property.price}
🛏 ${property.bedrooms} BHK`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// 🧪 DEBUG DB
const debugDb = async (req, res) => {
  const Property = require("../models/Property");
  const data = await Property.find();
  return res.json({ count: data.length, data });
};

module.exports = {
  handleIncomingMessage,
  verifyWebhook,
  debugDb,
};