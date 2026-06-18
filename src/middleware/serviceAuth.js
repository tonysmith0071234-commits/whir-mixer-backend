const { serviceApiKey } = require("../config/env");

module.exports = function serviceAuth(req, res, next) {
  const key = req.headers["x-service-key"];
  if (!serviceApiKey || key !== serviceApiKey) {
    return res.status(401).json({ error: "Invalid service key" });
  }
  next();
};
