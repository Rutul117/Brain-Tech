require("dotenv").config();
const { Router } = require("express");
const axios = require("axios");
const passport = require("../config/passport");
const gitRouter = Router()

// Initialize Passport
gitRouter.use(passport.initialize());
gitRouter.use(passport.session());

// GitHub OAuth login route
gitRouter.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub OAuth callback route
gitRouter.get('/auth/github/callback',
    passport.authenticate('github', {
        successRedirect: '/ ',
        failureRedirect: '/user/login',
    })
);



module.exports = {
    gitRouter
}