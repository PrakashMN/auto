const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "Route not found"
  });
};

module.exports = notFoundHandler;
