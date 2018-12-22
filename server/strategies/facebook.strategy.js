var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/api/user/fb/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        pool.query('SELECT * FROM person WHERE facebook_id = $1', [profile.id])
        .then((result) => {
            const user = result && result.rows && result.rows[0];
            if (user) {
                //found facebook id
                done(null, user);
            } else if (!user) {
                //cant find facebook id -- so create one
                pool.query(`INSERT INTO "person"("full_name", "facebook_id")
                VALUES($1, $2) RETURNING *;`, [profile.displayName, profile.id])
                .then( (result) => {
                    const user = result && result.rows && result.rows[0];
                    done(null, user);
                }).catch( err => {
                    console.log('error in creating fb credentials:', err);
                    done(null, {});
                })
                done(null, false, { message: 'Error with facebook login.' });
            } else {
                done(null, false);
            }
        }).catch((err) => {
            console.log('error', err);
            done(null, {});
        });
    }
));