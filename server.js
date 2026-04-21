const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const webhookRoutes = require("./src/routes/webhookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/webhook", webhookRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "property-bot service is running"
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});