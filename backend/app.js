require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");

const { userRouter } = require("./routes/user.route")
const { openaiRouter } = require("./routes/openai.route")

// Middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Code-Converter-App" });
});

app.use("/user", userRouter)
app.use("/openai", openaiRouter)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
