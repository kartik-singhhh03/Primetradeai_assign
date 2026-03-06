const notFound = require("./notFound");
const errorHandler = require("./errorHandler");
const authenticate = require("./authMiddleware");
const authorizeRole = require("./roleMiddleware");

module.exports = { notFound, errorHandler, authenticate, authorizeRole };
