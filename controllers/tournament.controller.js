const id = require("faker/lib/locales/id_ID");
const Tournament = require("../models/Tournament.model");

const createTournament = async (req, res, next) => {
  const { name, _class, students, numberOfRounds } = req.body;
  let participantsData = [];

  for (x of students) {
    participantsData.push({ participantID: x });
  }

  const { _id: organiser } = req.payload;

  await Tournament.create({
    name,
    _class,
    participantsData,
    numberOfRounds,
    organiser,
  });
  res.send("tournament created");
};

const getTournament = async (req, res, next) => {
  try {
    const { tournamentId: id } = req.params;
    const individualTournament = await Tournament.findById(id)
      .populate("_class")
      .populate("participantsData.participantID");
    res.json({ individualTournament });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTournament, getTournament };
