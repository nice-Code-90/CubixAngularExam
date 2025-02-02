require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const path = require("path");

const app = express();
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
