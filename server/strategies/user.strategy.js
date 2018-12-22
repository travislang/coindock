const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM person WHERE id = $1', [id]).then((result) => {
    // Handle Errors
    const user = result && result.rows && result.rows[0];

    if (!user) {
      // user not found
      done(null, false, { message: 'Incorrect username or password.' });
    } else {
      // user found
      delete user.password; // remove password so it doesn't get sent
      done(null, user);
    }
  }).catch((err) => {
    console.log('query err ', err);
    done(err);
  });
});

// Does actual work of logging in
passport.use('local', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'username',
}, ((req, username, password, done) => {
    pool.query('SELECT * FROM person WHERE username = $1', [username])
      .then((result) => {
        const user = result && result.rows && result.rows[0];
        if (user && encryptLib.comparePassword(password, user.password)) {
          // all good! Passwords match!
          done(null, user);
        } else if (user) {
          // not good! Passwords don't match!
            done(null, false, { message: 'Incorrect username or password.' });
        } else {
          // not good! No user with that name
          done(null, false);
        }
      }).catch((err) => {
        console.log('error', err);
        done(null, {});
      });
  })));

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/user/fb/callback",
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'first_name', 'profileUrl']
},
    function (accessToken, refreshToken, profile, done) {
        const profilePicture = profile.photos[0].value;
        console.log(profilePicture);
        pool.query('SELECT * FROM person WHERE facebook_id = $1', [profile.id])
            .then((result) => {
                const user = result && result.rows && result.rows[0];
                if (user) {
                    //found facebook id
                    done(null, user);
                } else if (!user) {
                    //cant find facebook id -- so create one
                    pool.query(`INSERT INTO "person"("name", "facebook_id", "facebook_image")
                                VALUES($1, $2, $3) RETURNING *;`, [profile.displayName, profile.id, profile.photos[0].value])
                    .then((results) => {
                        const newUser = results && results.rows &&results.rows[0];
                        if(newUser) {
                            console.log('made id to add', newUser);
                            done(null, newUser);
                        } 
                    }).catch(err => {
                        console.log('error in creating fb credentials:', err);
                        done(null, {});
                    });
                } else {
                    done(null, false, { message: 'Error with facebook login.' });
                }
            }).catch((err) => {
                console.log('error', err);
                done(null, {});
            });
    }
));

module.exports = passport;
