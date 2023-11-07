const express = require('express');
const router = express.Router();

// Import route handlers
const authRouter = require('./auth');
// const adminRouter = require('./admin');
// const ownerRouter = require('./owner');
// const driverRouter = require('./driver');
// const conductorRouter = require('./conductor');
// const passengerRouter = require('./passenger');

// Mount the routers
router.use('/auth', authRouter);
// router.use('/admin', adminRouter);
// router.use('/owner', ownerRouter);
// router.use('/driver', driverRouter);
// router.use('/conductor', conductorRouter);
// router.use('/passenger', passengerRouter);

module.exports = router;
