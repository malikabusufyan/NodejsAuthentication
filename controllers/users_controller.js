const User = require("../models/user");

module.exports.profile = function (req, res) {
  try {
    if (req.session.user_id) {
      User.findById(req.session.user_id)
        .then((user) => {
          if (user) {
            return res.render("user_profile", {
              title: "User Profile",
              user: user,
            });
          } else {
            return res.redirect("/users/sign-in");
          }
        })
        .catch((err) => {
          console.log("Error finding user:", err);
          return res.redirect("/users/sign-in");
        });
    } else {
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error in profile:", err);
    return res.redirect("/users/sign-in");
  }
};

// render the sign up page
module.exports.signUp = function (req, res) {
  try {
    return res.render("user_sign_up", {
      title: "Sign Up",
    });
  } catch (err) {
    console.log("Error in sign up:", err);
    return res.redirect("/users/sign-in");
  }
};

// render the sign in page
module.exports.signIn = function (req, res) {
  try {
    return res.render("user_sign_in", {
      title: "Sign In",
    });
  } catch (err) {
    console.log("Error in sign in:", err);
    return res.redirect("/users/sign-in");
  }
};

// get the sign up data
module.exports.create = function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect("back");
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return User.create(req.body);
        } else {
          return Promise.reject("User already exists");
        }
      })
      .then((user) => {
        return res.redirect("/users/sign-in"); // Redirect to sign-in page
      })
      .catch((err) => {
        console.log("Error in creating user while signing up:", err);
        return res.redirect("/users/sign-up"); // Redirect back to sign-up page on error
      });
  } catch (err) {
    console.log("Error in create:", err);
    return res.redirect("/users/sign-up");
  }
};
// sign in and create a session for the user
module.exports.createSession = function (req, res) {
  try {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user && user.password === req.body.password) {
          req.session.user_id = user.id; // Store user ID in the session
          return res.redirect("/users/profile"); // Redirect to user profile
        } else {
          return Promise.reject("Invalid email or password");
        }
      })
      .catch((err) => {
        console.log("Error in finding user or signing in:", err);
        return res.redirect("/users/sign-in"); // Redirect back to sign-in page on error
      });
  } catch (err) {
    console.log("Error in createSession:", err);
    return res.redirect("/users/sign-in");
  }
};

// sign out and destroy the session
module.exports.destroySession = function (req, res) {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log("Error in destroying session", err);
      }
      return res.redirect("/");
    });
  } catch (err) {
    console.log("Error in destroySession:", err);
    return res.redirect("/");
  }
};
