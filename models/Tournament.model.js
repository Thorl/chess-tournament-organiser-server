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
    school: {
      type: String,
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
    roundPairings: { type: Map, of: Object },
    /*  {
      round1: [
        {
          player1: {
            id: { type: Schema.Types.ObjectId, ref: "Student" },
            name: String,
            result: {
              type: String,
              enum: ["win", "lose", "draw", ""],
              default: "",
            },
          },
          player2: {
            id: { type: Schema.Types.ObjectId, ref: "Student" },
            name: String,
            result: {
              type: String,
              enum: ["win", "lose", "draw", ""],
              default: "",
            },
          },
        },
      ],
    } */
    status: {
      type: String,
      required: true,
      enum: ["inactive", "active", "finished"],
      default: "inactive",
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
