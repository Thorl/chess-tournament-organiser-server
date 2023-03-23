const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createTournament,
  getTournamentDetails,
} = require("../controllers/tournaments.controller");

router.post("/new-tournament", isAuthenticated, createTournament);

router.get("/:tournamentId", isAuthenticated, getTournamentDetails);
module.exports = router;
