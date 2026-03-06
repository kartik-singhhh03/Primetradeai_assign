const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const routes = require("./src/routes");
const { notFound, errorHandler } = require("./src/middleware");

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all routes
app.use("/api", routes);

// 404 handler — must come after all routes
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
