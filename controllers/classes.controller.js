const Class = require("../models/Class.model");
const Teacher = require("../models/Teacher.model");

const postNewClass = async (req, res, next) => {
  try {
    await Class.create(req.body);
    res.send("class created");
  } catch (err) {
    next(err);
  }
};

const getClasses = async (req, res, next) => {
  const { _id: teacherId } = req.payload;

  try {
    const teacher = await Teacher.findById(teacherId).populate("classes");

    const classes = teacher.classes;

    res.json(classes);
  } catch (error) {
    next(error);
  }
};

const getClassDetails = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const classDetails = await Class.findById(classId).populate("students");

    res.json(classDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = { postNewClass, getClasses, getClassDetails };
