const { Schema, model } = require("mongoose");

const tournamentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    _class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    participantsData: {
      type: [
        {
          participantID: { type: Schema.Types.ObjectId, ref: "Student" },
          points: {
            type: Number,
            required: true,
            default: 0,
          },
          numberOfRoundsCompleted: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      validate: [arrayLimit, "A tournament must have at least 5 participants"],
    },

    status: {
      type: String,
      required: true,
      default: "ongoing",
    },
    organiser: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    numberOfRounds: {
      type: Number,
      required: true,
      minLength: 2,
      maxLength: 20,
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length >= 5;
}

const Tournament = model("Tournament", tournamentSchema);

module.exports = Tournament;
