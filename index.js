const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
//Use of express Layout
const expressLayouts = require("express-ejs-layouts");
//Accessing Database
const db = require("./config/mongoose");
//Accessign express Session and setting up
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Accessing MongoStore from the MongoConnect Library to store session
const MongoStore = require("connect-mongo");

//use of static Files
app.use(express.static("./assets"));

app.use(expressLayouts);
//Extract of CSS links and Scripts Tag and put them at the head and bottom of the file
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup the view Engine
app.set("view engine", "ejs");
app.set("views", "./views");

//Use of Session
app.use(
  session({
    name: "NodejsAuthentiation",
    //TODO before going for the production
    secret: "something",
    //SaveUnitialized means the user is not logged in so we dont want to add extra space
    saveUninitialized: false,
    //resave is if the user is not changing any data we dont need to save it again and again
    //thats why we put resave as false
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    //MongoSession is used to store the session in the db
    store: MongoStore.create(
      {
        mongoUrl:
          "mongodb+srv://malikabusufyan:e1ugkDTl83sFypky@cluster0.h7zsuku.mongodb.net/?retryWrites=true&w=majority",
        collectionName: "sessions",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "Connect-Mongodb Setup Ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//For the authentication
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//Use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is Running Perfectly: ${port}`);
});
