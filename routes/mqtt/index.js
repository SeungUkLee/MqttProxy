const router = require('express');
const devices = require('./devices');

router.use('/devices',devices);

module.exports = router;
