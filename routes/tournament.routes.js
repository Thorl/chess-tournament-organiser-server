const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  createTournament,
  getTournament,
} = require("../controllers/tournament.controller");

router.post("/new-tournament", isAuthenticated, createTournament);

router.get("/:tournamentId", isAuthenticated, getTournament);
module.exports = router;
