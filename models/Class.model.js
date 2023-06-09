const { Schema, model } = require("mongoose");

const classSchema = new Schema(
  {
    students: {
      type: [{ type: Schema.Types.ObjectId, ref: "Student" }],
      default: [],
      minLength: 5,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Class = model("Class", classSchema);

module.exports = Class;
