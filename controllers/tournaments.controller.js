// const id = require("faker/lib/locales/id_ID");
const Tournament = require("../models/Tournament.model");
const Teacher = require("../models/Teacher.model");

const createTournament = async (req, res, next) => {
  try {
    const { name, _class, students, numberOfRounds } = req.body;

    const participantsData = [];

    for (const studentId of students) {
      participantsData.push({ student: studentId });
    }

    const { _id: organiser } = req.payload;

    const createdTournament = await Tournament.create({
      name,
      _class,
      participantsData,
      numberOfRounds,
      organiser,
    });

    await Teacher.findByIdAndUpdate(organiser, {
      $push: { tournaments: createdTournament },
    });

    res.sendStatus(201);
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
      .populate("participantsData.student");
    console.log(tournament);
    res.json(tournament);
  } catch (err) {
    next(err);
  }
};

const generateTournamentPairings = async (req, res, next) => {
  const { participantsData, roundNumber } = req.body;

  try {
    const students = participantsData.map((participantObj) => {
      return participantObj.student;
    });

    const studentsSortedByPoints = [...students].sort(
      (studentOne, studentTwo) => {
        if (
          studentOne.pointsData.totalPoints > studentTwo.pointsData.totalPoints
        ) {
          return -1;
        } else if (
          studentOne.pointsData.totalPoints < studentTwo.pointsData.totalPoints
        ) {
          return 1;
        } else {
          return 0;
        }
      }
    );

    const roundPairings = {};

    roundPairings[`round${roundNumber}`] = [];

    for (let i = 0; i < studentsSortedByPoints.length; i += 2) {
      const pair = studentsSortedByPoints.slice(i, i + 2);

      const player1 = {
        student: pair[0],
        result: "",
      };

      const player2 = {
        student: pair[1],
        result: "",
      };

      roundPairings[`round${roundNumber}`].push({ player1, player2 });
    }

    res.json({ roundPairings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTournament,
  getTournamentDetails,
  getTournaments,
  generateTournamentPairings,
};
