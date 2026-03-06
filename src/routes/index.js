const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/v1/auth', authRoutes);

module.exports = router;
