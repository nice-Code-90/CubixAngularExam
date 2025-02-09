const fs = require("fs");
const path = require("path");
const recipeModel = require("../models/recipeModel");

module.exports = {
  createRecipe: (data, res) => {
    const { title, description, picture, ingredients, userId } = data;
    recipeModel.createRecipe(
      title,
      description,
      picture,
      ingredients,
      userId,
      (err, id) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        recipeModel.getRecipeById(id, (err, recipe) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json(recipe);
        });
      }
    );
  },

  getRecipeById: (req, res) => {
    const { id } = req.params;
    recipeModel.getRecipeById(id, (err, recipe) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      recipe.ingredients = JSON.parse(recipe.ingredients);

      res.json(recipe);
    });
  },

  getAllRecipes: (req, res) => {
    recipeModel.getAllRecipes((err, recipes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      recipes.forEach((recipe) => {
        recipe.ingredients = JSON.parse(recipe.ingredients);
      });
      res.json(recipes);
    });
  },

  updateRecipe: (reqData, res) => {
    const { id, title, description, picture, ingredients, userId } = reqData;

    recipeModel.getRecipeById(id, (err, recipe) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (!recipe) return res.status(404).json({ error: "Recipe not found" });

      if (recipe.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this recipe" });
      }

      recipeModel.updateRecipe(
        id,
        title,
        description,
        picture,
        ingredients,
        userId,
        (err, changes) => {
          if (err) return res.status(500).json({ error: "Update failed" });

          if (changes === 0) {
            return res.status(404).json({ error: "Recipe not updated" });
          }

          recipeModel.getRecipeById(id, (err, updatedRecipe) => {
            if (err)
              return res
                .status(500)
                .json({ error: "Failed to fetch updated recipe" });

            res.json(updatedRecipe);
          });
        }
      );
    });
  },

  deleteRecipe: (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    recipeModel.getRecipeById(id, (err, recipe) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (recipe.userId !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this recipe" });
      }

      if (recipe.picture) {
        const picturePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(recipe.picture)
        );
        fs.unlink(picturePath, (err) => {
          if (err) {
            console.error("Failed to delete picture:", err);
          } else {
          }
        });
      }
      recipeModel.deleteRecipe(id, userId, (err, changes) => {
        if (err) {
          console.error("Error deleting recipe:", err);
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res
            .status(404)
            .json({ error: "Recipe not found or not authorized" });
        }
        res.json({ message: "Recipe deleted" });
      });
    });
  },

  likeRecipe: (id, res) => {
    recipeModel.likeRecipe(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      recipeModel.getRecipeById(id, (err, recipe) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        recipe.ingredients = JSON.parse(recipe.ingredients);
        res.json(recipe);
      });
    });
  },
  dislikeRecipe: (id, res) => {
    recipeModel.dislikeRecipe(id, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      recipeModel.getRecipeById(id, (err, recipe) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        recipe.ingredients = JSON.parse(recipe.ingredients);

        res.json(recipe);
      });
    });
  },
  checkRecipeOwnership: (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    recipeModel.getRecipeById(id, (err, recipe) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      const isOwner = userId === recipe.userId;
      res.json({ isOwner });
    });
  },
};
