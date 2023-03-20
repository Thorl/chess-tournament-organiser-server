const Teacher = require("../models/Teacher.model");

const postAccountDetails = async (req, res, next) => {
  try {
    const currentUser = await Teacher.findById(req.payload._id);
    console.log(currentUser);
    res.json({ msg: "hi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { postAccountDetails };
