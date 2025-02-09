const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/auth");

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/profile", authenticate, userController.getUserProfile);

router.get("/:id", authenticate, userController.getUserById);
router.delete("/delete", userController.deleteUser);
router.put("/change-password", authenticate, userController.changePassword);

module.exports = router;
