const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  getStudentDetails,
  postStudentDetails,
  deleteStudent,
} = require("../controllers/Student.controller");

router.get("/:studentId", isAuthenticated, getStudentDetails);

router.post("/:studentId", isAuthenticated, postStudentDetails);

router.post("/:studentId/delete", isAuthenticated, deleteStudent);

module.exports = router;
