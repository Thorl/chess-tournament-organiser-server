const { Schema, model } = require("mongoose");

const teacherSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: false,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = model("Teacher", teacherSchema);

module.exports = Teacher;
