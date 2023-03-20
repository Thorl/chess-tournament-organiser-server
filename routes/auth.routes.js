const router = require("express").Router();

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  postSignup,
  postLogin,
  getVerify,
} = require("../controllers/auth.controller");

router.post("/signup", postSignup);

router.post("/login", postLogin);

router.get("/verify", isAuthenticated, getVerify);

module.exports = router;
