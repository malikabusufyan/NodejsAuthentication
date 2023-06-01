//Importing Passport and Passport Local
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//Importing User From Model
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email })
        .then(async (user) => {
          if (!user) {
            console.log("Invalid Email or Password");
            return req.res.redirect("/users/sign-in");
          }

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            console.log("Invalid Email or Password");
            return req.res.redirect("/users/sign-in");
          }

          return done(null, user);
        })
        .catch((err) => {
          console.log("Error in Finding the User ---> Passport");
          return done(err);
        });
    }
  )
);

// //Authentication Using Passport
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passReqToCallback: true,
//     },
//     function (req, email, password, done) {
//       //Find a User and establish the identity
//       User.findOne({ email: email })
//         .then((user) => {
//           if (!user || user.password != password) {
//             console.log("Invalid Username and Password");
//             return req.res.redirect("/users/sign-in");
//           }
//           //Return the User if both the above condition failed
//           return done(null, user);
//         })
//         .catch((err) => {
//           console.log("Error in Finding the User ---> Passport");
//           return done(err);
//         });
//     }
//   )
// );

//Serializing the User to decide which key we need to keep in the cookie
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Deserializing the User from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      console.log("Error in Finding the User ---> Passport");
      return done(err);
    });
});

//Check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in passed on the next function request (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if the user is not signed-in
  return res.redirect("/users/sign-in");
};

//Move to the View file once the user got authenticated
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    //req.user contains the current signed in user session cookie
    //and we are just sending to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
