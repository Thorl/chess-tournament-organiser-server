const Class = require("../models/Class.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

const createNewClass = async (req, res, next) => {
  const { _id: teacherId } = req.payload;

  try {
    const { name, school, students } = req.body;

    const studentsArray = [];

    for (const student of students) {
      const createdStudent = await Student.create({ name: student });
      studentsArray.push(createdStudent._id);
    }

    const createdClass = await Class.create({
      name,
      school,
      students: studentsArray,
    });

    await Teacher.findByIdAndUpdate(teacherId, {
      $push: { classes: createdClass },
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

const getClasses = async (req, res, next) => {
  const { _id: teacherId } = req.payload;

  try {
    const classes = await Teacher.findById(teacherId, "classes").populate({
      path: "classes",
      populate: { path: "students" },
    });

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

module.exports = { createNewClass, getClasses, getClassDetails };
