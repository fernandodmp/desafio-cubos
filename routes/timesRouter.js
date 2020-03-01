const rulesController = require('./../controllers/rulesController');
const timesValidators = require('./../validators/timesValidators');
const express = require('express');
const router = express.Router();

router
  .route('/')
  .get(timesValidators.validateTimeInterval, rulesController.getAvailableTimes);

module.exports = router;
