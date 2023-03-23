// const id = require("faker/lib/locales/id_ID");
const Tournament = require("../models/Tournament.model");

const createTournament = async (req, res, next) => {
  const { name, _class, students, numberOfRounds } = req.body;

  const participantsData = [];

  for (const studentId of students) {
    participantsData.push({ participantID: studentId });
  }

  const { _id: organiser } = req.payload;

  await Tournament.create({
    name,
    _class,
    participantsData,
    numberOfRounds,
    organiser,
  });
  res.sendStatus(201);
};

const getTournamentDetails = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    const individualTournament = await Tournament.findById(tournamentId)
      .populate("_class")
      .populate("participantsData.participantID");
    res.json({ individualTournament });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTournament, getTournamentDetails };
