// const id = require("faker/lib/locales/id_ID");
const Tournament = require("../models/Tournament.model");
const Teacher = require("../models/Teacher.model");

const createTournament = async (req, res, next) => {
  try {
    let { name, _class, school, students, numberOfRounds } = req.body;

    if (typeof name !== "string") {
      name = name.toString();
    }

    if (typeof numberOfRounds !== "number") {
      numberOfRounds = +numberOfRounds;
    }

    if (
      !name.trim() ||
      !_class?.trim() ||
      !school?.trim() ||
      !students.length ||
      students.length % 2 ||
      !numberOfRounds
    ) {
      res.json({
        errorMessage:
          "The tournament must have a name, class, school, an even number of students, and at least one round!",
      });
      return;
    }

    const participantsData = [];

    for (const studentId of students) {
      participantsData.push({ participantID: studentId });
    }

    const { _id: organiser } = req.payload;

    const createdTournament = await Tournament.create({
      name,
      _class,
      school,
      participantsData,
      numberOfRounds,
      organiser,
    });

    await Teacher.findByIdAndUpdate(organiser, {
      $push: { tournaments: createdTournament },
    });

    res.json({ tournamentId: createdTournament._id });
  } catch (error) {
    next(error);
  }
};

const getTournaments = async (req, res, next) => {
  try {
    const { _id: teacherId } = req.payload;

    const tournaments = await Teacher.findById(
      teacherId,
      "tournaments"
    ).populate({
      path: "tournaments",
      populate: { path: "_class" },
    });

    res.json(tournaments);
  } catch (error) {
    next(error);
  }
};

const getTournamentDetails = async (req, res, next) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await Tournament.findById(tournamentId)
      .populate("_class")
      .populate("participantsData.participantID");

    res.json(tournament);
  } catch (err) {
    next(err);
  }
};

module.exports = { createTournament, getTournamentDetails, getTournaments };
