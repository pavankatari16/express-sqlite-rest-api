const express = require("express");
const { createUserRoutes } = require("./routes/userRoutes");
const { initDb } = require("./config/db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ FIX: sync DB init (NO .then)
const db = initDb();

// routes
app.use("/users", createUserRoutes(db));

// root
app.get("/", (req, res) => {
  res.status(200).send("User API is running");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status ?? err.statusCode ?? 500;
  const isServerError = status >= 500;

  if (isServerError) console.error(err);

  res.status(status).json({
    message: isServerError
      ? "Internal Server Error"
      : err.message || "Bad Request",
  });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});