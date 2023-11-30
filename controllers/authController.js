const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = process.env.SECRET_KEY;
const secretExpiry = process.env.SECRET_KEY_EXPIRY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const refreshExpiry = process.env.REFRESH_SECRET_KEY_EXPIRY;

if (!secretKey || !secretExpiry || !refreshSecretKey || !refreshExpiry) {
  throw new Error("One or more required environment variables are missing.");
}

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    secretKey,
    { expiresIn: secretExpiry }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    refreshSecretKey,
    { expiresIn: refreshExpiry }
  );
};

const authController = {
  registerUser: async (req, res) => {
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

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(200).json({
        token: accessToken,
        expiresIn: secretExpiry,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Login failed." });
    }
  },

  refreshToken: async (req, res) => {
    const { token } = req.body;
    console.log("token", token, req.body);

    try {
      const decoded = jwt.verify(token, refreshSecretKey);

      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log("User not found");
        return res
          .status(401)
          .json({ error: "Invalid user associated with the refresh token" });
      }

      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      res
        .status(200)
        .json({ token: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  },
};

module.exports = authController;
