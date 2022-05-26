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
router.post("/resetPassword",auth.userAuthentication, controller.resetPassword)
router.post("/changePassword",auth.userAuthentication, controller.changePassword)
router.get("/logout",auth.userAuthentication, controller.logout)
router.get("/notification",auth.userAuthentication, controller.emailVerify)
router.get("/account",auth.userAuthentication, controller.account)
router.get("/accountDelete",auth.userAuthentication, controller.accountDelete)
router.get("/aboutGet",controller.aboutGet)
router.get("/setting",auth.userAuthentication, controller.emailVerify)

module.exports = router;
