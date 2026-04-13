const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you can save the user to your DB
    // For now, we'll just pass the profile
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user); // You can store user.id instead if using DB
});

passport.deserializeUser((user, done) => {
  done(null, user);
});