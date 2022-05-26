var express = require('express');
var router = express.Router();
var auth = require('../src/Modules/auth');
var controller = require('../src/Controllers/AdminController')
router.post("/aboutAdd", controller.aboutAdd)
module.exports = router;