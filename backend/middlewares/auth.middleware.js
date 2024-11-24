const jwt = require("jsonwebtoken");
require("dotenv").config();

const { UserModel } = require("../models/user.model");
const { BlacklistModel } = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Checking for blacklisted token
    const isBlacklisted = await BlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).send({ message: "Token is blacklisted" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedToken);
    const { userId } = decodedToken;

    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    // Attach the user to the request object
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Access token expired" });
    }
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

module.exports = {
  authMiddleware,
};
