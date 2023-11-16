import { Router } from "express";
import User from "../Models/user.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("route for user authentication");
});

router.post("/signup", async (req, res) => {
  try {
    // check if email id already exists
    const exisitingUser = await User.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(409)
        .send({ error: "Signup failed! User already exists" });
    }
    // hash psssword
    req.body.password = await bycrypt.hash(req.body.password, 10);
    // creae user model
    const user = User(req.body);
    // save user data in DB
    const result = await user.save();
    if (result) {
      // if saved successfully
      res.status(201).send({ success: "User created successfully" });
    } else {
      // if failed to save
      res.status(409).send({ error: "Couldn't create user" });
    }
  } catch (error) {
    res.status(409).send({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    // distructure email and password
    const { email, password } = req.body;
    // encode password
    // check if user exists
    const user = await User.findOne({ email });
    // if user exists
    if (user) {
      // password macthes
      if (bycrypt.compare(req.body.password, user.password)) {
        // copy user
        const payload = { ...user.toJSON() };
        payload.password = undefined;
        payload.refreshTokens = undefined;
        // generate access token

        const token = generateAccessToken(payload);
        // generate refresh token
        const refreshToken = generateRefreshToken(payload);
        // save refresh token in database
        user.refreshTokens.push(refreshToken);
        await user.save();
        // Set an HTTP-only cookie with a long expiration time
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 365 * 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({ token, refreshToken, user: payload });
      }
      return res.status(403).send({ error: "Incorrect password" });
    } else {
      // if user not exists
      return res.status(404).send({ error: "User does not exist" });
    }
  } catch (error) {
    res.status(409).send({ error: error.message });
  }
});

// validate token
router.post("/token", async (req, res) => {
  // else get refresh token
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "refresh token is not available" });
  }

  // validate refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    async (err, data) => {
      if (err) {
        if (err)
          return res
            .status(200)
            .json({ isValid: false, message: "Invalid refresh token" });
      }
      try {
        // find user with refresh token
        const user = await User.findOne({
          email: data.email,
          refreshTokens: { $in: [refreshToken] },
        });

        if (!user) {
          res.clearCookie("refreshToken");
          return res
            .status(200)
            .json({ isValid: false, message: "Unauthorized" });
        }
        user.password = undefined;
        user.refreshTokens = undefined;
        const accessToken = generateAccessToken(user.toJSON());
        res.status(200).json({ isValid: true, token: accessToken, user: user });
      } catch (error) {
        console.log("errror", error);
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  );
});

router.post("/validate-token", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(200)
        .json({ isValid: false, message: "Invalid access token" });
    res.status(200).json({ isValid: true, user: user });
  });
});
router.delete("/logout", async (req, res) => {
  try {
    // refresh token
    const refreshToken = req.cookies.refreshToken;

    // verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, data) => {
        if (err)
          if (err) return res.status(401).json({ message: "Unauthorised" });
        const user = await User.findById(data._id);
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        // Save the updated user document
        await user.save();
        // Clear the refresh token cookie on the client side
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
}
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET_KEY);
}

export default router;
