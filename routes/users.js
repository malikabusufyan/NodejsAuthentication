const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users_controller");

router.get("/profile", usersController.profile);

//Creating the SignUp
router.post("/create", usersController.create);

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

module.exports = router;
