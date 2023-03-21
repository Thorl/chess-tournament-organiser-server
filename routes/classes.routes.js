const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  postNewClass,
  getClasses,
} = require("../controllers/classes.controller");

router.post("/new-class", isAuthenticated, postNewClass);

router.get("/classes", isAuthenticated, getClasses);

module.exports = router;
