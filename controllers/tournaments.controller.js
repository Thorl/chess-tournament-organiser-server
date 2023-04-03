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
      roundPairings: {},
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
      .populate("participantsData.student");
    res.json(tournament);
  } catch (err) {
    next(err);
  }
};

const generateTournamentPairings = async (req, res, next) => {
  const { participantsData, roundNumber, startTournament } = req.body;

  console.log("ParticipantsData: ", participantsData);

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
      }
      // "roundPairings"
    );

    if (startTournament) {
      result.status = "active";
    }

    const roundPairings = result.roundPairings;

    const createdRound = [];

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

      createdRound.push({ player1, player2 });
    }

    roundPairings.set(`round${roundNumber}`, createdRound);

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
    const tournament = await Tournament.findOne({
      organiser: teacherId,
      _id: tournamentId,
    }).populate("participantsData.student");

    const roundPairings = tournament.roundPairings;

    console.log("Tournament: ", tournament);

    const participantsData = tournament.participantsData;

    if (!winningPlayerId) {
      for (const pair of roundPairings.get(round)) {
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
          const updatedResults = roundPairings.get(`round${roundNumber}`);
          roundPairings.set(`round${roundNumber}`, []);
          roundPairings.set(`round${roundNumber}`, updatedResults);
          break;
        }
      }
    } else {
      for (const pair of roundPairings.get(round)) {
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
          const updatedResults = roundPairings.get(`round${roundNumber}`);
          roundPairings.set(`round${roundNumber}`, []);
          roundPairings.set(`round${roundNumber}`, updatedResults);
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

          const updatedResults = roundPairings.get(`round${roundNumber}`);
          roundPairings.set(`round${roundNumber}`, []);
          roundPairings.set(`round${roundNumber}`, updatedResults);
          break;
        }
      }
    }

    await tournament.save();

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
