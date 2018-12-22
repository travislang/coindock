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
      delete user.fb_access_token; // remove facebook info so it isnt sent
      delete user.facebook_id;
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
// Setup new facebook strategy
passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:5000/auth/facebook/return',
    profileFields: ['id', 'displayName', 'picture.type(large)', 'first_name']
},  // this is called after facebook authorizes user
    function (accessToken, refreshToken, profile, done) {
        // grab user info from DB
        pool.query('SELECT * FROM person WHERE facebook_id = $1', [profile.id])
            .then((result) => {
                const user = result && result.rows && result.rows[0];
                //found facebook id
                if (user) {
                    done(null, user);
                //cant find facebook id -- so create one
                } else if (!user) {
                    //get first name if one is set otherwise display name
                    let name = profile.name.givenName || profile.displayName;
                    pool.query(`INSERT INTO "person"("name", "facebook_id", "facebook_image", "fb_access_token")
                                VALUES($1, $2, $3, $4) RETURNING *;`, [name, profile.id, profile.photos[0].value, accessToken])
                    .then((results) => {
                        const newUser = results && results.rows &&results.rows[0];
                        if(newUser) {
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
