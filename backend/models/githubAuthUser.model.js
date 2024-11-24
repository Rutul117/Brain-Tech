const mongoose = require("mongoose");

const githubUserSchema = mongoose.Schema(
    {
        githubId: { type: String, required: true, unique: true },
        fullname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String }, 
        accessToken: { type: String, required: true },
        refreshToken: { type: String },
    },
    {
        versionKey: false,
    }
);

const GitHubUserModel = mongoose.model("githubUser", githubUserSchema);

module.exports = {
    GitHubUserModel,
};
