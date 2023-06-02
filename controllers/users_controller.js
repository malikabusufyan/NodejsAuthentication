const User = require("../models/user");
const bcrypt = require("bcrypt");

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Change password action
module.exports.changePassword = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!match) {
      req.flash("error", "Password doesn't match!");
      return res.redirect("/users/change-password");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    req.flash("success", "Password Changes Successfully");
    return res.redirect("/users/profile");
  } catch (err) {
    console.log("Error in changing password:", err);
    return res.redirect("/users/change-password");
  }
};

//Render Router for SignUp
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_up", {
    title: "NodeJs Authentication | Sign Up",
  });
};

//Render Router for SignIn
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("user_sign_in", {
    title: "NodeJs Authentication | Sign In",
  });
};

// //Get the SignUp Data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Password Doesn't Matched");
    return res.redirect("back");
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        about: req.body.about,
      });
      req.flash("success", "Signed Up Successfully");
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in finding/creating the user for signup", err);
    return res.status(500).send("Internal Server Error");
  }
};

// module.exports.create = async function (req, res) {
//   if (req.body.password != req.body.confirm_password) {
//     return res.redirect("back");
//   }

//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       const newUser = await User.create(req.body);
//       return res.redirect("/users/sign-in");
//     } else {
//       return res.redirect("back");
//     }
//   } catch (err) {
//     console.log("error in finding/creating the user for signup", err);
//     return res.status(500).send("Internal Server Error");
//   }
// };

//Get the SignIn Data
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/profile");
};

//Sign_out or Destroying the Session
// module.exports.destroySession = function(req, res){
//     req.logout();
//     return res.redirect('/');
// }

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in destroying session", err);
      return res.redirect("/");
    }
    req.flash("success", "Logged Out Successfully");
    res.clearCookie("NodejsAuthentiation");
    return res.redirect("/");
  });
};

// const User = require("../models/user");

// module.exports.profile = function (req, res) {
//   try {
//     if (req.session.user_id) {
//       User.findById(req.session.user_id)
//         .then((user) => {
//           if (user) {
//             return res.render("user_profile", {
//               title: "User Profile",
//               user: user,
//             });
//           } else {
//             return res.redirect("/users/sign-in");
//           }
//         })
//         .catch((err) => {
//           console.log("Error finding user:", err);
//           return res.redirect("/users/sign-in");
//         });
//     } else {
//       return res.redirect("/users/sign-in");
//     }
//   } catch (err) {
//     console.log("Error in profile:", err);
//     return res.redirect("/users/sign-in");
//   }
// };

// // render the sign up page
// module.exports.signUp = function (req, res) {
//   try {
//     return res.render("user_sign_up", {
//       title: "Sign Up",
//     });
//   } catch (err) {
//     console.log("Error in sign up:", err);
//     return res.redirect("/users/sign-in");
//   }
// };

// // render the sign in page
// module.exports.signIn = function (req, res) {
//   try {
//     return res.render("user_sign_in", {
//       title: "Sign In",
//     });
//   } catch (err) {
//     console.log("Error in sign in:", err);
//     return res.redirect("/users/sign-in");
//   }
// };

// // get the sign up data
// module.exports.create = function (req, res) {
//   try {
//     if (req.body.password != req.body.confirm_password) {
//       return res.redirect("back");
//     }

//     User.findOne({ email: req.body.email })
//       .then((user) => {
//         if (!user) {
//           return User.create(req.body);
//         } else {
//           return Promise.reject("User already exists");
//         }
//       })
//       .then((user) => {
//         return res.redirect("/users/sign-in"); // Redirect to sign-in page
//       })
//       .catch((err) => {
//         console.log("Error in creating user while signing up:", err);
//         return res.redirect("/users/sign-up"); // Redirect back to sign-up page on error
//       });
//   } catch (err) {
//     console.log("Error in create:", err);
//     return res.redirect("/users/sign-up");
//   }
// };

// // sign in and create a session for the user
// module.exports.createSession = function (req, res) {
//   try {
//     User.findOne({ email: req.body.email })
//       .then((user) => {
//         if (user && user.password === req.body.password) {
//           req.session.user_id = user.id; // Store user ID in the session
//           return res.redirect("/users/profile"); // Redirect to user profile
//         } else {
//           return Promise.reject("Invalid email or password");
//         }
//       })
//       .catch((err) => {
//         console.log("Error in finding user or signing in:", err);
//         return res.redirect("/users/sign-in"); // Redirect back to sign-in page on error
//       });
//   } catch (err) {
//     console.log("Error in createSession:", err);
//     return res.redirect("/users/sign-in");
//   }
// };

// // sign out and destroy the session
// module.exports.destroySession = function (req, res) {
//   try {
//     req.session.destroy(function (err) {
//       if (err) {
//         console.log("Error in destroying session", err);
//       }
//       return res.redirect("/");
//     });
//   } catch (err) {
//     console.log("Error in destroySession:", err);
//     return res.redirect("/");
//   }
// };
