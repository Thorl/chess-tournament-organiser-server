const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const {
  getAccountDetails,
  updateAccountDetails,
  deleteAccount,
} = require("../controllers/account-details.controller");

router.get("/account-details", isAuthenticated, getAccountDetails);
router.post("/account-details", isAuthenticated, updateAccountDetails);
router.post("/account-details/delete", isAuthenticated, deleteAccount);

module.exports = router;
