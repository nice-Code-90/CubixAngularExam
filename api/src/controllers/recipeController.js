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

  updateRecipe: (req, res) => {
    const { id } = req.params;
    const { title, description, picture, ingredients, userId } = req.body;
    recipeModel.updateRecipe(
      id,
      title,
      description,
      picture,
      ingredients,
      userId,
      (err, changes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res
            .status(404)
            .json({ error: "Recipe not found or not authorized" });
        }
        recipeModel.getRecipeById(id, (err, updatedRecipe) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json(updatedRecipe);
        });
      }
    );
  },

  deleteRecipe: (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    recipeModel.deleteRecipe(id, userId, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (changes === 0) {
        return res
          .status(404)
          .json({ error: "Recipe not found or not authorized" });
      }
      res.json({ message: "Recipe deleted" });
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
};
