require("dotenv").config();

require("./db");

const express = require("express");

const app = express();

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const accountdetailsRoutes = require("./routes/account-details.routes");
app.use("/", accountdetailsRoutes);

const classRoutes = require("./routes/classes.routes");
app.use("/classes", classRoutes);

const tournamentRoutes = require("./routes/tournaments.routes");
app.use("/tournaments", tournamentRoutes);

require("./error-handling")(app);

module.exports = app;
