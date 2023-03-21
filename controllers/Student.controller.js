const Student = require("../models/Student.model");

const getStudentDetails = async (req, res, next) => {
  try {
    const individualStudent = await Student.findById(req.params.studentId);
    res.json({ individualStudent });
  } catch (err) {
    next(err);
  }
};

const updateStudentDetails = async (req, res, next) => {
  try {
    const { studentId: id } = req.params;
    await Student.findByIdAndUpdate(id, req.body);
    const updatedStudent = await Student.findById(id);
    res.json({ updatedStudent });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { studentId: id } = req.params;
    await Student.findByIdAndRemove(id);
    res.send("Student Deleted");
  } catch (err) {
    next(err);
  }
};
module.exports = { getStudentDetails, updateStudentDetails, deleteStudent };
