const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createNewClass,
  getClasses,
} = require("../controllers/classes.controller");

router.post("/new-class", isAuthenticated, createNewClass);

router.get("/", isAuthenticated, getClasses);

module.exports = router;
