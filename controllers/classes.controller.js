const Class = require("../models/Class.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

const createNewClass = async (req, res, next) => {
  const { _id: teacherId } = req.payload;

  try {
    const { name, school, students } = req.body;

    if (students.length === 0) {
      res.json({
        errorMessage: "Please add at least one student to the class!",
      });
      return;
    }

    if (!name?.trim()) {
      res.json({ errorMessage: "Please enter a class name!" });
      return;
    }

    if (!school?.trim()) {
      res.json({ errorMessage: "Please enter a school name!" });
      return;
    }

    const checkIfClassIsinDb = async () => {
      try {
        const teacher = await Teacher.findById(teacherId).populate("classes");

        const classesArray = teacher.classes;

        console.log("Classes array: ", classesArray);

        const isClassInDb = classesArray.some((classObj) => {
          return classObj.name === name && classObj.school === school;
        });

        console.log("Is class in db: ", isClassInDb);

        return isClassInDb;
      } catch (error) {
        console.log(
          "An error occured while searching if the class already exists: ",
          error
        );
      }
    };

    const doesClassExist = await checkIfClassIsinDb();

    if (doesClassExist) {
      res.json({
        errorMessage:
          "The class you're trying to create already exists! If you would like to edit the class, please select it from your list of classes.",
      });
      return;
    }

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
