var express = require('express');
var router = express.Router();
var auth = require('../src/Modules/auth');
var controller = require('../src/Controllers/UserController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", controller.login)
router.post("/userSignup", controller.userSignup)
router.post("/otpVerify",auth.userAuthentication, controller.verifyOtp)
module.exports = router;
