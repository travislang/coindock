
const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const authRouter = require('./routes/auth.router');
const cryptoRouter = require('./routes/crypto.router');

//cors middleware
// const corsOptions = {
//     credentials: true,
// };
// app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/crypto', cryptoRouter);
app.use('/auth', authRouter);

// Serve static files
app.use(express.static('build'));


// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
