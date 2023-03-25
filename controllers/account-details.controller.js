const Teacher = require("../models/Teacher.model");
const bcrypt = require("bcryptjs");

const getAccountDetails = async (req, res, next) => {
  const { _id: teacherId } = req.payload;
  try {
    const { firstName, lastName, email } = await Teacher.findById(
      teacherId,
      "firstName lastName email"
    );
    res.json({ firstName, lastName, email });
  } catch (err) {
    next(err);
  }
};

const updateAccountDetails = async (req, res, next) => {
  try {
    const { _id: teacherId } = req.payload;

    const { hashedPassword: currentHashedPassword } = await Teacher.findById(
      teacherId
    );

    const {
      email,
      firstName,
      lastName,
      currentPassword,
      newPassword,
      repeatedNewPassword,
    } = req.body;

    const isNewPasswordValid = (newPassword) => {
      const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

      return regex.test(newPassword);
    };

    const isNewEmailValid = (newEmail) => {
      const regex = /^\S+@\S+\.\S+$/;

      return regex.test(newEmail);
    };

    if (!isNewEmailValid) {
      res.json({ errorMessage: "Please enter a valid email address!" });
      return;
    }

    if (!currentPassword && !newPassword && !repeatedNewPassword) {
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        { email, firstName, lastName },
        { new: true }
      );

      res.json(updatedTeacher);
    } else {
      if (!bcrypt.compareSync(currentPassword, currentHashedPassword)) {
        res.json({ errorMessage: "Incorrect password!" });
        return;
      }

      if (newPassword !== repeatedNewPassword) {
        res.json({ errorMessage: "The new passwords must match!" });
        return;
      }

      if (currentPassword === newPassword) {
        res.json({
          errorMessage: "The new and existing passwords must be different!",
        });
      }

      if (!isNewPasswordValid(newPassword)) {
        res.json({
          errorMessage:
            "Invalid password! The password must be at least 6 characters long, and contain at least one number, one uppercase and one lowercase character.",
        });
        return;
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        {
          firstName,
          lastName,
          email,
          hashedPassword: newHashedPassword,
        },
        { new: true }
      );
      res.json(updatedTeacher);
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
