const { Schema, model } = require("mongoose");

const classSchema = new Schema(
  {
    students: {
      type: [{ type: Schema.Types.ObjectId, ref: "Student" }],
      default: [],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Class = model("Class", classSchema);

module.exports = Class;
