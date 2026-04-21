const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
  logger.error("Unhandled error", {
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack
  });

  return res.status(error.statusCode || 500).json({
    status: "error",
    message: error.publicMessage || "Internal server error"
  });
};

module.exports = errorHandler;
