const express = require('express');
const router = express.Router();
const rulesController = require('./../controllers/rulesController');

/* GET home page. */
router
  .route('/')
  .post(rulesController.validateRule, rulesController.createRule)
  .get(rulesController.getAllRules);

router.route('/availableTimes').get(rulesController.getAvailableTimes);

router
  .route('/:id')
  .get(rulesController.getSingleRule)
  .delete(rulesController.deleteRule);

module.exports = router;
