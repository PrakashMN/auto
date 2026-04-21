const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  res.on("finish", () => {
    logger.info("Completed request", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    });
  });

  next();
};

module.exports = requestLogger;
