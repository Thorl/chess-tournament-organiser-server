const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { editAccountDetails } = require("../controllers/Teacher.controller");

router.get("/edit-details", isAuthenticated, editAccountDetails);


module.exports = router;