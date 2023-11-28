const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;
const secretExpiry = process.env.SECRET_KEY_EXPIRY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const refreshExpiry = process.env.REFRESH_SECRET_KEY_EXPIRY;

if (!secretKey) {
  throw new Error("Secret key is not defined.");
}

if (!secretExpiry) {
  throw new Error("Access Token Expiration is not defined.");
}

if (!refreshSecretKey) {
  throw new Error("Refresh Secret key is not defined.");
}

if (!refreshExpiry) {
  throw new Error("Refresh Token Expiration is not defined.");
}

const authController = {
  registerUser: async function (req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Registration failed." });
    }
  },
  loginUser: async function (req, res) {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: secretExpiry }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        refreshSecretKey,
        { expiresIn: refreshExpiry }
      );

      res.status(200).json({
        token: accessToken,
        expiresIn: 3600,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed." });
    }
  },
  refreshToken: async function (req, res) {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, refreshSecretKey);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp <= currentTimestamp) {
        return res.status(401).json({ error: "Refresh token has expired" });
      }

      const user = await User.findOne({ _id: decoded.userId });

      if (!user) {
        return res
          .status(401)
          .json({ error: "Invalid user associated with the refresh token" });
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: secretExpiry }
      );

      const newRefreshToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        refreshSecretKey,
        { expiresIn: refreshExpiry }
      );

      res
        .status(200)
        .json({ token: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Invalid refresh token" });
    }
  },
};

module.exports = authController;
