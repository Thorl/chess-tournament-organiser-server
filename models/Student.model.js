const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      minLength: 2,
      maxLength: 20,
    },
    pointsData: {
      totalPoints: {
        type: Number,
        required: true,
        default: 0,
      },
      totalRounds: {
        type: Number,
        required: true,
        default: 0,
      },
      totalTournaments: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    blacklistPairings: {
      type: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    },
    previousTournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
  },
  {
    timestamps: true,
  }
);

const Student = model("Student", studentSchema);

module.exports = Student;
