const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createNewClass,
  getClasses,
  getClassDetails,
  editStudentDetails,
  deleteStudent,
  addStudent,
} = require("../controllers/classes.controller");

router.get("/", isAuthenticated, getClasses);

router.post("/new-class", isAuthenticated, createNewClass);

router.get("/:classId", isAuthenticated, getClassDetails);

router.post("/:classId/edit-student", isAuthenticated, editStudentDetails);

router.post("/:classId/delete-student", isAuthenticated, deleteStudent);

router.post("/:classId/add-student", isAuthenticated, addStudent);

module.exports = router;
