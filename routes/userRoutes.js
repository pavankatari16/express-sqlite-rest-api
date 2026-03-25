const express = require("express");
const userController = require("../controllers/userController");

function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function createUserRoutes(db) {
  // Provide database access to the controller/model.
  userController.setDb(db);

  const router = express.Router();

  // List users (optional search + sorting)
  router.get("/", asyncHandler(userController.getUsers));

  // Get single user
  router.get("/:id", asyncHandler(userController.getUserById));

  // Create user
  router.post("/", asyncHandler(userController.createUser));

  // Update user
  router.put("/:id", asyncHandler(userController.updateUser));

  // Delete user
  router.delete("/:id", asyncHandler(userController.deleteUser));

  return router;
}

module.exports = { createUserRoutes };

