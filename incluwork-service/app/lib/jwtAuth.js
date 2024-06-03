import passport from "passport";

const jwtAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({ error: "Unauthorized Access" });
      return;
    }

    // Modifying the user object attached to the request
    // Renaming _id to id and converting it to a string
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      type: user.type,
      contactNumber: user.contactNumber
    };

    next();
  })(req, res, next);
};

export default jwtAuth;