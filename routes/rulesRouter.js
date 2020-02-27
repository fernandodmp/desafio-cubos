const express = require('express');
const router = express.Router();
const rulesController = require('./../controllers/rulesController');

/* GET home page. */
router
  .route('/')
  .post(rulesController.validateRule, rulesController.createRule);

module.exports = router;
