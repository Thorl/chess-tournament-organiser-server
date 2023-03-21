const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createNewClass,
  getClasses,
  getClassDetails,
} = require("../controllers/classes.controller");

router.get("/", isAuthenticated, getClasses);

router.post("/new-class", isAuthenticated, createNewClass);

router.get("/:classId", isAuthenticated, getClassDetails);

module.exports = router;
