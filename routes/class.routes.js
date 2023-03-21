const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { postNewClass } = require("../controllers/Class.controller");

router.post("/new-class", isAuthenticated, postNewClass);

module.exports = router;
