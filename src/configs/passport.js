const LocalStrategy = require("passport-local").Strategy;
const connection = require("../configs/DBConnection");

module.exports = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "mailid",

        passwordField: "password",

        passReqToCallback: true, //passback entire req to call back
      },
      function (req, mailid, password, done) {
        if (!mailid || !password) {
          return done(null, false, {
            message: "All fields are required",
          });
        }

        connection.query(
          "SELECT * FROM faculty WHERE mailid= ?",
          [mailid],
          function (err, rows) {
            if (!rows.length) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }

            let dbPassword = rows[0].password;

            if (!(dbPassword === password)) {
              return done(null, false, {
                message: "Password incorrect",
              });
            }

            return done(null, rows[0]);
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.mailId);
  });

  passport.deserializeUser(function (mailid, done) {
    connection.query(
      "SELECT * FROM faculty WHERE mailid= ?",
      [mailid],
      function (err, rows) {
        done(err, rows[0]);
      }
    );
  });
};
