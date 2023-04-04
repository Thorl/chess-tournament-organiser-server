const mongoose = require("mongoose");
const Teacher = require("../models/Teacher.model");
const MONGO_URI = require("../db/index");
const faker = require("faker");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const generateTeacher = () => {
  let name = faker.name.findName();
  let password = faker.internet.password() + "AbC123";
  let salt = bcrypt.genSaltSync(saltRounds);
  let hashedPassword = bcrypt.hashSync(password, salt);
  return {
    email: faker.internet.email(name),
    password,
    hashedPassword,
    name,
  };
};

const generateTeachers = (length) => {
  const teachers = [];
  Array.from({ length }).forEach(() => {
    teachers.push(generateTeacher());
  });
  return teachers;
};

const teacherData = generateTeachers(10);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connection Made");
    Teacher.create(teacherData);
  })
  .catch((error) => {
    console.log(error);
  });
