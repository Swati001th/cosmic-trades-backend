var express = require('express');
var router = express.Router();
var auth = require('../src/Modules/auth');
var controller = require('../src/Controllers/AdminController')
router.post("/aboutAdd", controller.aboutAdd)
router.post("/login", controller.adminLogin)
router.get("/list/users", controller.getUserList)


module.exports = router;