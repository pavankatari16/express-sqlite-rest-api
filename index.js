const express = require("express");
const { createUserRoutes } = require("./routes/userRoutes");
const { initDb } = require("./config/db");

const app = express();

// Global JSON body parser
app.use(express.json());

// Health/root endpoint
app.get("/", (req, res) => {
  res.status(200).send("User API is running");
});

const PORT = process.env.PORT || 3000;

// Start server only after DB is initialized
initDb()
  .then((db) => {
    // Attach routes after DB is ready
    app.use("/users", createUserRoutes(db));

    // 404 handler for unknown endpoints
    app.use((req, res) => {
      res.status(404).json({ message: "Not found" });
    });

    // Global error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      // Default to 500; callers can override via `err.status` or `err.statusCode`
      const status = err.status ?? err.statusCode ?? 500;
      const isServerError = Number(status) >= 500;
      const message = isServerError
        ? "Internal Server Error"
        : err.message ?? "Bad Request";

      if (isServerError) {
        // Keep server logs useful; don't leak stack traces to clients
        console.error(err);
      }

      res.status(status).json({ message });
    });

    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT}`);
  });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

