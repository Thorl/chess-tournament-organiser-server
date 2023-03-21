const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  postNewClass,
  getClasses,
  getClassDetails,
} = require("../controllers/classes.controller");

router.post("/new-class", isAuthenticated, postNewClass);

router.get("/classes", isAuthenticated, getClasses);

router.get("classes/:classId", isAuthenticated, getClassDetails);

module.exports = router;
