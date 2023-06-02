// This is a middleware to use flash for sending notification
module.exports.setFlash = function (req, res, next) {
  res.locals.flash = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  next();
};
