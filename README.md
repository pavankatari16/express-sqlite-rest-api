# 🚀 Express SQLite REST API

This project is a simple REST API built using Node.js, Express, and SQLite. It handles basic user management operations like creating, reading, updating, and deleting users.

The goal of this project is to demonstrate a clean backend architecture using MVC pattern, proper error handling, and secure query handling.

---

## 📌 Features

- Create a new user
- Fetch all users (with optional search and sorting)
- Fetch a single user by ID
- Update user details
- Delete a user
- Input validation
- Centralized error handling
- SQLite database integration

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- SQLite3

---

## 📁 Project Structure

config/ → Database setup and initialization  
controllers/ → Handles request/response logic  
models/ → Database queries and logic  
routes/ → API route definitions  
data/ → SQLite database file  
index.js → Application entry point  

---

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone <your-repo-link>  
cd express-sqlite-rest-api  

---

### 2. Install dependencies

npm install  

---

### 3. Run the server

node index.js  

Server will start at:  
http://localhost:3000  

---

## 📡 API Endpoints

### 🔹 Health Check

GET /

Response:  
User API is running  

---

### 🔹 Get All Users

GET /users  

Optional query parameters:  
/users?search=alice&sort=name&order=asc  

---

### 🔹 Get User by ID

GET /users/:id  

---

### 🔹 Create User

POST /users  

Request Body:
{
  "name": "Pavan",
  "email": "pavan@test.com"
}

---

### 🔹 Update User

PUT /users/:id  

Request Body:
{
  "name": "Updated Name",
  "email": "updated@test.com"
}

---

### 🔹 Delete User

DELETE /users/:id  

---

## ⚠️ Notes

- Name and email are required
- Email must be unique
- Sorting supports only "name"
- Order supports "asc" and "desc"

---

## 🧠 Design Decisions

- Used MVC architecture for separation of concerns
- Implemented async/await for clean asynchronous handling
- Centralized error handling middleware
- Prevented SQL injection by restricting sort fields
- Lightweight SQLite database used for simplicity

---

## 🚀 Future Improvements

- Add JWT authentication
- Add pagination support
- Add unit and integration testing
- Migrate to PostgreSQL for scalability

---

## 👨‍💻 Author

Pavan Katari