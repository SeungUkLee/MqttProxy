const router = require('express').Router();
const controller = require('./controller');

router.put('/:id', controller.deviceCheck);

module.exports = router;
