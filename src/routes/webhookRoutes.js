const express = require("express");
const router = express.Router();

const {
  handleIncomingMessage,
  verifyWebhook,
  debugDb
} = require("../controllers/webhookController");

// 🔐 Meta verification
router.get("/whatsapp", verifyWebhook);

// 📩 Incoming messages
router.post("/whatsapp", handleIncomingMessage);

// 🧪 Debug
router.get("/debug", debugDb);

module.exports = router;