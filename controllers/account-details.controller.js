const Teacher = require("../models/Teacher.model");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const getAccountDetails = async (req, res, next) => {
  const { _id: teacherId } = req.payload;
  try {
    const { firstName, lastName } = await Teacher.findById(
      teacherId,
      "firstName lastName"
    );
    res.json({ firstName, lastName });
  } catch (err) {
    next(err);
  }
};

const updateAccountDetails = async (req, res, next) => {
  try {
    const { _id: id } = req.payload;
    const currentUser = await Teacher.findById(id);
    const { hashedPassword } = currentUser;
    const {
      email,
      name,
      currentPassword,
      newPasswordFirst,
      newPasswordSecond,
    } = req.body;

    //if user wants to change email and/or name, but not their password

    if (!currentPassword && !newPasswordFirst && !newPasswordSecond) {
      await Teacher.findByIdAndUpdate(req.payload._id, { email, name });
      const updatedTeacher = await Teacher.findById(id); // so that updated document gets returned
      console.log(updatedTeacher);
      res.json({ updatedTeacher });
    } else {
      // if user wants to change their password
      if (!bcrypt.compareSync(currentPassword, hashedPassword)) {
        res.send("incorrect password");
      }

      if (newPasswordFirst !== newPasswordSecond) {
        res.send("passwords must match");
      }

      if (currentPassword === newPasswordFirst) {
        res.send("new and existing passwords must be different");
      }

      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      if (!regex.test(newPasswordFirst)) {
        res.send(
          "Password not long enough. Must contain at least one uppercase letter"
        );
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const newHashedPassword = await bcrypt.hash(newPasswordFirst, salt);
      await Teacher.findByIdAndUpdate(id, {
        name,
        email,
        password: newPasswordFirst,
        hashedPassword: newHashedPassword,
      });
      const updatedTeacher = await Teacher.findById(id);
      console.log(updatedTeacher);
      res.json({ updatedTeacher });
    }
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await Teacher.findByIdAndRemove(req.payload._id);
    res.send("document deleted");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAccountDetails, updateAccountDetails, deleteAccount };
