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
        const value = `"${mailid}"`;
        const sql = `SELECT * FROM vehicle_owners WHERE mailid=${value}`;
        connection.query(sql, (err, rows) => {
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
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.mailid);
  });

  passport.deserializeUser(function (mailid, done) {
    const value = `"${mailid}"`;
    const sql = `SELECT * FROM vehicle_owners WHERE mailid=${value}`;
    connection.query(sql, (err, rows) => {
      done(err, rows[0]);
    });
  });
};
