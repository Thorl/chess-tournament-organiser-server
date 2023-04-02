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
    participantsData: [
      {
        student: { type: Schema.Types.ObjectId, ref: "Student" },
        points: {
          type: Number,
          required: true,
          default: 0,
        },
        numberOfRounds: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    roundPairings: {
      round1: [
        {
          player1: {
            student: { type: Schema.Types.ObjectId, ref: "Student" },
            result: {
              type: String,
              enum: ["win", "lose", "draw", ""],
              default: "",
            },
          },
          player2: {
            student: { type: Schema.Types.ObjectId, ref: "Student" },
            result: {
              type: String,
              enum: ["win", "lose", "draw", ""],
              default: "",
            },
          },
        },
      ],
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

const Tournament = model("Tournament", tournamentSchema);

module.exports = Tournament;
