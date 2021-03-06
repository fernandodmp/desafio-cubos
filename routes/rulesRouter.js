const express = require('express');
const router = express.Router();
const rulesController = require('./../controllers/rulesController');
const rulesValidator = require('./../validators/rulesValidators');

router
  .route('/')
  .post(rulesValidator.validateRule, rulesController.createRule)
  .get(rulesController.getAllRules);

router
  .route('/:id')
  .get(rulesController.getSingleRule)
  .delete(rulesController.deleteRule);

module.exports = router;
