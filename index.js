import express from "express";
import usuarioRoutes from "./Routes/usuarioRoutes.js";
import db from "./config/db.js";

// Create app
const app = express();

// Enable reading of form data
app.use(express.urlencoded({ extended: true }));

// Database connection
try {
  await db.authenticate();
  db.sync();
  console.log("Correct connection to the database");
} catch (error) {
  console.log(error);
}

// Enable PUG
app.set("view engine", "pug");
app.set("views", "./views");

// Public Folder
app.use(express.static("public"));

// Routing
app.use("/auth", usuarioRoutes);

// Define port and run proyect
const port = 3000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
