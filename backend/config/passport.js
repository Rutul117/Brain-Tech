require("dotenv").config()
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const { GitHubUserModel } = require("../models/githubAuthUser.model");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET_KEY,
      callbackURL: "http://localhost:8080/github-auth",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        const user = await GitHubUserModel.findOne({ githubId: profile.id });

        if (user) {
          // If the user already exists, update their access token and other information
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          await user.save();
        } else {
          // If the user doesn't exist, create a new user in your database
          const newUser = new GitHubUserModel({
            githubId: profile.id,
            fullname: profile.name,
            username: profile.login,
            email: profile.email,
            accessToken: accessToken,
            refreshToken: refreshToken
          });
          await newUser.save();
        }

        // Pass the user information to the next step
        return done(null, profile);
      } catch (error) {
        // Handle errors
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
