const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { postAccountDetails } = require("../controllers/Teacher.controller");

router.get("/account-details", isAuthenticated, postAccountDetails);

module.exports = router;
