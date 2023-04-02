const Tournament = require("../models/Tournament.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

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
    const studentsSortedByPoints = [...participantsData].sort(
      (studentOne, studentTwo) => {
        if (studentOne.points > studentTwo.points) {
          return -1;
        } else if (studentOne.points < studentTwo.points) {
          return 1;
        } else {
          return 0;
        }
      }
    );

    const { _id: teacherId } = req.payload;
    const { tournamentId } = req.params;

    const result = await Tournament.findOne(
      {
        organiser: teacherId,
        _id: tournamentId,
      },
      "roundPairings"
    );

    const roundPairings = result.roundPairings;

    roundPairings[`round${roundNumber}`] = [];

    for (let i = 0; i < studentsSortedByPoints.length; i += 2) {
      const pair = studentsSortedByPoints.slice(i, i + 2);

      const playerOneId = pair[0].student._id;
      const playerOneName = pair[0].student.name;

      const playerTwoId = pair[1].student._id;
      const playerTwoName = pair[1].student.name;

      const player1 = {
        id: playerOneId,
        name: playerOneName,
        result: "",
      };

      const player2 = {
        id: playerTwoId,
        name: playerTwoName,
        result: "",
      };

      roundPairings[`round${roundNumber}`].push({ player1, player2 });
    }

    await result.save();

    res.json({ roundPairings });
  } catch (error) {
    next(error);
  }
};

const updateScore = async (req, res, next) => {
  const { _id: teacherId } = req.payload;
  const { tournamentId } = req.params;
  const { winningPlayerId, playerOneId, playerTwoId, roundNumber } = req.body;
  const round = "round" + roundNumber;

  try {
    const result = await Tournament.findOne({
      organiser: teacherId,
      _id: tournamentId,
    }).populate("participantsData.student");

    const roundPairings = result.roundPairings;

    const participantsData = result.participantsData;

    if (!winningPlayerId) {
      for (const pair of roundPairings[round]) {
        let playerOne = pair.player1;
        let playerTwo = pair.player2;

        const currentPlayerOneId = pair.player1.id.toString();
        const currentPlayerTwoId = pair.player2.id.toString();

        if (
          currentPlayerOneId === playerOneId &&
          currentPlayerTwoId === playerTwoId
        ) {
          playerOne.result = "draw";
          playerTwo.result = "draw";

          break;
        }
      }
    } else {
      for (const pair of roundPairings[round]) {
        let playerOne = pair.player1;
        let playerTwo = pair.player2;

        const playerOneId = pair.player1.id.toString();
        const playerTwoId = pair.player2.id.toString();

        if (playerOneId === winningPlayerId) {
          playerOne.result = "win";

          await Student.findByIdAndUpdate(winningPlayerId, {
            $inc: { "pointsData.totalPoints": 3, "pointsData.totalRounds": 1 },
          });

          for (const participant of participantsData) {
            const participantId = participant.student._id.toString();

            if (participantId === winningPlayerId) {
              participant.points += 3;
            }
          }

          playerTwo.result = "lose";

          break;
        } else if (playerTwoId === winningPlayerId) {
          playerTwo.result = "win";

          await Student.findByIdAndUpdate(winningPlayerId, {
            $inc: { "pointsData.totalPoints": 3, "pointsData.totalRounds": 1 },
          });

          for (const participant of participantsData) {
            const participantId = participant.student._id.toString();

            if (participantId === winningPlayerId) {
              participant.points += 3;
            }
          }

          playerOne.result = "lose";

          break;
        }
      }
    }

    await result.save();

    res.json(roundPairings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTournament,
  getTournamentDetails,
  getTournaments,
  generateTournamentPairings,
  updateScore,
};
