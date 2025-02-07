const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

module.exports = {
  createUser: (req, res) => {
    const { username, password } = req.body;
    userModel.getUserByUsername(username, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      userModel.createUser(username, password, (err, id) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        userModel.getUserById(id, (err, user) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          const { password, ...userWithoutPassword } = user;

          res.status(201).json(userWithoutPassword);
        });
      });
    });
  },

  loginUser: (req, res) => {
    const { username, password } = req.body;
    userModel.getUserByUsername(username, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
        res.json({ token });
      });
    });
  },

  getUserById: (req, res) => {
    const { id } = req.params;
    userModel.getUserById(id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    });
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      if (decoded.id !== parseInt(id, 10)) {
        return res
          .status(403)
          .json({ error: "You can only delete your own account" });
      }

      userModel.deleteUser(id, (err, changes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      });
    });
  },
};
