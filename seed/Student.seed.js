const mongoose = require("mongoose");
const Student = require("../models/Student.model");
const MONGO_URI = require("../db/index");
const faker = require("faker");

const generateStudent = () => {
  return {
    name: faker.name.firstName(),
    pointsData: {
      totalPoints: faker.datatype.number({
        min: 10,
        max: 50,
      }),
    },
  };
};

const generateStudents = (length) => {
  const students = [];
  Array.from({ length }).forEach(() => {
    students.push(generateStudent());
  });
  return students;
};

const studentData = generateStudents(50);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connection Made");
    Student.create(studentData);
  })
  .catch((error) => {
    console.log(error);
  });
