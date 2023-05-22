const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_controller");

console.log("Index from Routes");
router.get("/", homeController.home);
//To maintain all the list of users in the file
router.use("/users", require("./users"));

module.exports = router;
