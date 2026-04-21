const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "property-bot service is running"
  });
});

module.exports = router;
