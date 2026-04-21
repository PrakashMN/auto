const express = require("express");
const router = express.Router();

const { handleIncomingMessage, debugDb } = require("../controllers/webhookController");

router.post("/whatsapp", handleIncomingMessage);
router.get("/debug", debugDb);

module.exports = router;