import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import testRouter from "./Routes/test.js";
import questionRouter from "./Routes/question.js";
import authRouter from "./Routes/auth.js";
import cookieParser from "cookie-parser";

dotenv.config();

// get environment variables
const PORT = process.env.PORT;
const URI = process.env.URI;

// create express app
const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "https://dreamy-cocada-4930e9.netlify.app/",
      "https://655500ca5edda13ede885ddf--beautiful-otter-4cbc03.netlify.app/",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(cookieParser());

// create routes
app.get("/", (req, res) => {
  res.send("This is api for TestManiac App");
});

app.use("/tests", testRouter);
app.use("/questions", questionRouter);
app.use("/auth", authRouter);

// connect to momgodb and run server
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
