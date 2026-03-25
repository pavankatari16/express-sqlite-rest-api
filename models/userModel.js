const crypto = require("crypto");

function validateOrder(order) {
  if (!order) return "ASC";
  const normalized = String(order).toLowerCase();
  if (normalized === "asc") return "ASC";
  if (normalized === "desc") return "DESC";
  return null;
}

function validateSort(sort) {
  if (!sort) return "name";
  const normalized = String(sort).toLowerCase();
  if (normalized === "name") return "name";
  return null;
}

function generateId() {
  // Node 14.17+ generally supports randomUUID
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function createUserModel(db) {
  async function listUsers({ search, sort, order }) {
    const safeSort = validateSort(sort);
    if (!safeSort) {
      const err = new Error("Invalid sort. Allowed: name");
      err.status = 400;
      throw err;
    }

    const safeOrder = validateOrder(order);
    if (!safeOrder) {
      const err = new Error("Invalid order. Allowed: asc or desc");
      err.status = 400;
      throw err;
    }

    let sql = "SELECT id, name, email, created_at FROM users";
    const whereParts = [];
    const params = [];

    const trimmedSearch = search == null ? "" : String(search).trim();
    if (trimmedSearch) {
      whereParts.push("(name LIKE ? OR email LIKE ?)");
      const pattern = `%${trimmedSearch}%`;
      params.push(pattern, pattern);
    }

    if (whereParts.length > 0) {
      sql += ` WHERE ${whereParts.join(" AND ")}`;
    }

    // Only `name` is permitted for sorting to avoid SQL injection via identifiers.
    sql += ` ORDER BY ${safeSort} ${safeOrder}`;

    return db.all(sql, params);
  }

  async function getUserById(id) {
    return db.get("SELECT id, name, email, created_at FROM users WHERE id = ?", [id]);
  }

  async function createUser({ name, email }) {
    const id = generateId();
    await db.run(
      "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
      [id, name, email]
    );

    // Return the created row (ensures consistent output)
    return getUserById(id);
  }

  async function updateUser(id, { name, email }) {
    const result = await db.run(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, id]
    );

    if (result.changes === 0) return null;
    return getUserById(id);
  }

  async function deleteUser(id) {
    const result = await db.run("DELETE FROM users WHERE id = ?", [id]);
    if (result.changes === 0) return false;
    return true;
  }

  return {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
}

module.exports = { createUserModel };

