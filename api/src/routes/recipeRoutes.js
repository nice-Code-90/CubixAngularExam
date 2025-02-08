const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const authenticate = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/", authenticate, upload.single("picture"), (req, res) => {
  const { title, description, ingredients } = req.body;
  const userId = req.userId;
  const picture = req.file ? `/uploads/${req.file.filename}` : null;

  recipeController.createRecipe(
    {
      title,
      description,
      picture,
      ingredients,
      userId,
    },
    res
  );
});

router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", authenticate, upload.single("picture"), (req, res) => {
  const { title, description, ingredients } = req.body;
  const userId = req.userId;
  const picture = req.file ? `/uploads/${req.file.filename}` : null;

  recipeController.updateRecipe(
    {
      id: req.params.id,
      title,
      description,
      picture,
      ingredients,
      userId,
    },
    res
  );
});
router.delete("/:id", authenticate, recipeController.deleteRecipe);
router.put("/:id/like", authenticate, (req, res) => {
  const { id } = req.params;
  recipeController.likeRecipe(id, res);
});
router.put("/:id/dislike", authenticate, (req, res) => {
  const { id } = req.params;
  recipeController.dislikeRecipe(id, res);
});

router.get(
  "/:id/check-ownership",
  authenticate,
  recipeController.checkRecipeOwnership
);

module.exports = router;
