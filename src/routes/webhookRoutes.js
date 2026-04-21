const express = require("express");
const router = express.Router();

const { handleIncomingMessage } = require("../controllers/webhookController");

router.post("/whatsapp", handleIncomingMessage);

module.exports = router;