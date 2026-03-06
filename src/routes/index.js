const express = require("express");
const authRoutes = require("./authRoutes");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

router.use("/v1/auth", authRoutes);
router.use("/v1/tasks", taskRoutes);

module.exports = router;
