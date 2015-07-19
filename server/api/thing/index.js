'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/carData', controller.getAccidentData);
router.get('/getTerrorData', controller.getTerrorData );
router.post('/query', controller.search );
router.get('/jobs', controller.getJobs )
router.post('/login', controller.login )
module.exports = router;