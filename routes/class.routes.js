const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { createNewClass } = require("../controllers/Class.controller");

router.post("/new-class", isAuthenticated, createNewClass);

module.exports = router;
