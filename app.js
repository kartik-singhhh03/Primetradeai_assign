const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

const routes = require("./src/routes");
const { notFound, errorHandler } = require("./src/middleware");
const logger = require("./src/utils/logger");

const app = express();

// Security headers — relax CSP for Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Swagger docs
const swaggerOptions = {
  customSiteTitle: "PrimeTradeAI API Docs",
  customCss: `
    body { background: #f0fdf4; }
    .swagger-ui .topbar { background: #15803d; padding: 10px 0; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info h2.title { color: #14532d; }
    .swagger-ui .info .description p { color: #374151; }
    .swagger-ui .scheme-container { background: #fff; box-shadow: 0 1px 4px rgba(22,163,74,0.1); }
    .swagger-ui .opblock.opblock-post .opblock-summary { border-color: #16a34a; }
    .swagger-ui .opblock.opblock-post { background: #f0fdf4; border-color: #16a34a; }
    .swagger-ui .opblock.opblock-get { background: #f0fdf4; border-color: #22c55e; }
    .swagger-ui .opblock.opblock-put { background: #fefce8; border-color: #ca8a04; }
    .swagger-ui .opblock.opblock-delete { background: #fef2f2; border-color: #dc2626; }
    .swagger-ui .btn.execute { background: #16a34a; border-color: #15803d; }
    .swagger-ui .btn.execute:hover { background: #15803d; }
    .swagger-ui section.models { background: #fff; }
    .swagger-ui .model-box { background: #f0fdf4; }
  `,
};
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions),
);

// Mount all routes
app.use("/api", routes);

// 404 handler — must come after all routes
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;
