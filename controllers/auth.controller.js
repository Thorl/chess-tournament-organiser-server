

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");



const saltRounds = 10;

const Teacher = require("../models/Teacher.model");


const postSignup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email, password" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const foundUser = await Teacher.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdTeacher = await Teacher.create({
      email,
      password: hashedPassword,
    });

    const { email: teacherEmail, _id } = createdTeacher;

    const user = { email, _id };

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = postSignup;
