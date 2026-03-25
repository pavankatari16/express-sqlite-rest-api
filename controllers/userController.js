const { createUserModel } = require("../models/userModel");

// Lazy-init wrapper: index initializes the DB and passes it via setDb()
let userModel = null;

function setDb(db) {
  userModel = createUserModel(db);
}

function requireNonEmptyString(value, fieldName) {
  const str = String(value ?? "").trim();
  if (!str) {
    const err = new Error(`${fieldName} is required`);
    err.status = 400;
    throw err;
  }
  return str;
}

function validateEmailFormat(email) {
  const str = String(email ?? "").trim();
  if (!str) {
    const err = new Error("email is required");
    err.status = 400;
    throw err;
  }

  // Simple, pragmatic format check (not a full RFC validator).
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(str)) {
    const err = new Error("email is invalid");
    err.status = 400;
    throw err;
  }
  return str;
}

function parseIdParam(id) {
  const str = String(id ?? "").trim();
  if (!str) {
    const err = new Error("id is required");
    err.status = 400;
    throw err;
  }
  return str;
}

function mapDbConstraintToHttp(err) {
  // sqlite3 typically surfaces UNIQUE constraint failures like:
  // "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email"
  const msg = typeof err?.message === "string" ? err.message.toLowerCase() : "";
  if (msg.includes("unique") && msg.includes("users.email")) {
    const e = new Error("A user with that email already exists");
    e.status = 400;
    return e;
  }
  return err;
}

async function getUsers(req, res) {
  const { search, sort, order } = req.query;
  const users = await userModel.listUsers({ search, sort, order });
  res.status(200).json(users);
}

async function getUserById(req, res) {
  const id = parseIdParam(req.params.id);
  const user = await userModel.getUserById(id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json(user);
}

async function createUser(req, res) {
  try {
    const name = requireNonEmptyString(req.body?.name, "name");
    const email = validateEmailFormat(req.body?.email);

    const user = await userModel.createUser({ name, email });
    res.status(201).json(user);
  } catch (err) {
    throw mapDbConstraintToHttp(err);
  }
}

async function updateUser(req, res) {
  try {
    const id = parseIdParam(req.params.id);
    const name = requireNonEmptyString(req.body?.name, "name");
    const email = validateEmailFormat(req.body?.email);

    const updated = await userModel.updateUser(id, { name, email });
    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (err) {
    throw mapDbConstraintToHttp(err);
  }
}

async function deleteUser(req, res) {
  const id = parseIdParam(req.params.id);
  const deleted = await userModel.deleteUser(id);

  if (!deleted) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({ message: "User deleted" });
}

module.exports = {
  setDb,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

