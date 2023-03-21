const Class = require("../models/Class.model");

const postNewClass = async (req, res, next) => {
  try {
    await Class.create(req.body);
    res.send("class created");
  } catch (err) {
    next(err);
  }
};

module.exports = { postNewClass };
