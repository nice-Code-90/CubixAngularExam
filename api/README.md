# Food Recipes API

## Overview

This project is a RESTful API for managing food recipes. It allows users to create, read, update, and delete recipes. Each recipe is associated with a user, ensuring that only the creator can modify or delete their recipes.

## Features

- Create a new recipe
- Retrieve all recipes or a specific recipe by ID
- Update an existing recipe
- Delete a recipe (only by the creator)

## Technologies Used

- Node.js
- Express
- SQLite

## Project Structure

```
food-recipes-api
└── food-recipes-api
|   ├── src
|       ├── controllers
|           └── recipeController.js
|           └── userController.js
|       ├── models
|           └── recipeModel.js
|           └── userModel.js
|       ├── routes
|           └── recipeRoutes.js
|           └── userRoutes.js
|       ├── app.js
|       └── database.js
|   ├── package.json
|   ├── .env
|   └── README.md
```

## Setup Instructions

1. **Clone the repository**

   ```
   git clone <repository-url>
   cd food-recipes-api
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the following:

   ```
   DATABASE_PATH=path/to/your/database.db
   ```

4. **Run the application**
   ```
   npm start
   ```

## API Endpoints

### Recipes

- **POST /recipes**: Create a new recipe
- **GET /recipes**: Retrieve all recipes
- **GET /recipes/:id**: Retrieve a recipe by ID
- **PUT /recipes/:id**: Update a recipe by ID
- **DELETE /recipes/:id**: Delete a recipe by ID

## License

This project is licensed under the MIT License.
