require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const healthRoutes = require("./src/routes/healthRoutes");
const propertyRoutes = require("./src/routes/propertyRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const requestLogger = require("./src/middleware/requestLogger");
const notFoundHandler = require("./src/middleware/notFoundHandler");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("./src/utils/logger");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.use("/", healthRoutes);
app.use("/api/property", propertyRoutes);
app.use("/webhook", webhookRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid JSON payload"
    });
  }

  return next(error);
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      logger.info("property-bot server is running", { port });
    });
  } catch (error) {
    logger.error("Failed to start server", { message: error.message });
    process.exit(1);
  }
};

startServer();
