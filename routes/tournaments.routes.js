const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createTournament,
  getTournamentDetails,
  getTournaments,
  generateTournamentPairings,
  updateScore,
} = require("../controllers/tournaments.controller");

router.get("/", isAuthenticated, getTournaments);

router.post("/new-tournament", isAuthenticated, createTournament);

router.get("/:tournamentId", isAuthenticated, getTournamentDetails);

router.post(
  "/:tournamentId/pairings",
  isAuthenticated,
  generateTournamentPairings
);

router.post("/:tournamentId/score", isAuthenticated, updateScore);

module.exports = router;
