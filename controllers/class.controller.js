const Class = require("../models/Class.model");
const Student = require("../models/Student.model");

const createNewClass = async (req, res, next) => {
  try {
    const { name, school, students } = req.body;
    let studentsArray = [];
    students.forEach(async (student) => {
      const createdStudent = await Student.create({ name: student });
      studentsArray.push(createdStudent);
    });
    await Class.create({
      name,
      school,
      students: studentsArray,
    });
    res.sendStatus(201)
  } catch (err) {
    next(err);
  }
};

module.exports = { createNewClass };
