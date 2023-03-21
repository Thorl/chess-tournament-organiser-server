const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const Teacher = require("../models/Teacher.model");

const postSignup = async (req, res, next) => {
  const saltRounds = 10;
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
      password,
      hashedPassword,
    });

    const { email: teacherEmail, _id } = createdTeacher;

    const user = { teacherEmail, _id };

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

const postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === "" || password === "") {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    const foundTeacher = await Teacher.findOne({ email });

    if (!foundTeacher) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    console.log("Password", password);

    console.log(
      "foundTeacher's hashed password: ",
      foundTeacher.hashedPassword
    );

    const passwordCorrect = bcrypt.compareSync(
      password,
      foundTeacher.hashedPassword
    );

    if (passwordCorrect) {
      const { _id, email, name } = foundTeacher;

      const payload = { _id, email, name };

      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } catch (error) {
    next(error);
  }
};

const getVerify = (req, res, next) => {
  console.log(`req.payload`, req.payload);

  res.status(200).json(req.payload);
};

module.exports = { postSignup, postLogin, getVerify };
