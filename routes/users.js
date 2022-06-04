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
router.post("/emailVerify",auth.userAuthentication, controller.emailVerify)
router.post("/resetPassword", controller.resetPassword)
router.post("/changePassword",auth.userAuthentication, controller.changePassword)
router.post("/varifyPassword", controller.varifyPassword)

router.post("/verify/otp", controller.OtpVerify)
router.get("/logout",auth.userAuthentication, controller.logout)
router.get("/notification",auth.userAuthentication, controller.emailVerify)
router.get("/account",auth.userAuthentication, controller.account)
router.get("/accountDelete",auth.userAuthentication, controller.accountDelete)
router.get("/aboutGet",controller.aboutGet)
router.get("/setting",auth.userAuthentication, controller.emailVerify)
router.get("/getIndices",auth.userAuthentication, controller.getIndices)

module.exports = router;
