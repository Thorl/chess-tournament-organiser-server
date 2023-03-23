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
      // inclusion of both password and hashedPassword in this model is for dev purposes only.
      // We can use the Teacher.seed.js file to generate Teacher logins, and since we know the password we can log in to test the app.
      // When the app gets deployed we will of course remove the password from the Teacher model and only store the hashedPassword
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
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
