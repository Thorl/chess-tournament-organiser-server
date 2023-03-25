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
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      minLength: 2,
      maxLength: 25,
    },
    classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
    tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
  },
  {
    timestamps: true,
  }
);

const Teacher = model("Teacher", teacherSchema);

module.exports = Teacher;
