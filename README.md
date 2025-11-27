To-Do App Backend (TypeScript + Express + MongoDB + JWT Auth)

This is the backend service for the Full-Stack To-Do Application, built using TypeScript, Node.js, Express, and MongoDB.
It provides APIs for user authentication, authorization, and CRUD operations for To-Dos.

The backend uses JWT-based authentication, secure password hashing, and follows a structured, scalable architecture.

🚀 Features
✅ User Authentication

User registration (Signup)

User login

Password hashing using bcrypt

JWT-based authentication

Access token + refresh token (if implemented)

Protected routes

✅ Authorization

Role-based authorization (optional)

Middleware to validate JWT

Secure routes for task CRUD

✅ To-Do CRUD

Create a Task

Get All Tasks (for a user)

Update Task

Delete Task

Mark as completed / pending

✅ Tech Stack

Node.js, Express.js

TypeScript

MongoDB + Mongoose

JWT

bcrypt

dotenv

CORS enabled

Project Structure
/src
 ├── config/
 │   └── db.ts              # MongoDB connection
 ├── controllers/
 │   ├── auth.controller.ts # Signup/Login logic
 │   └── todo.controller.ts # To-Do CRUD logic
 ├── middleware/
 │   └── auth.middleware.ts # JWT validation
 ├── models/
 │   ├── user.model.ts      # User schema
 │   └── todo.model.ts      # Todo schema
 ├── routes/
 │   ├── auth.routes.ts     # /api/auth/
 │   └── todo.routes.ts     # /api/todos/
 ├── utils/
 │   └── token.ts           # JWT helpers
 ├── app.ts                 # Express app config
 └── server.ts              # Server entrypoint
🛠️ Installation & Setup
1. Clone Repository
git clone https://github.com/your-username/todo-backend.git
cd todo-backend

2. Install Dependencies
npm install

3. Create .env File

Create a .env file in the root:

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/todoDB
JWT_SECRET=your_jwt_secret_key

4. Start Development Server
npm run dev

5. Build for Production
npm run build
npm start

🔐 API Endpoints
Auth APIs (/api/auth)
Method	Endpoint	Description
POST	/signup	Register a new user
POST	/login	Login & get token
Signup Request Example
{
  "name": "Rohit",
  "email": "rohit@example.com",
  "password": "password123"
}

Login Response Example
{
  "token": "jwt_token_string_here"
}

To-Do APIs (/api/todos)

(All routes below are protected)

Method	Endpoint	Description
GET	/	Get all todos for a user
POST	/	Create a new todo
PUT	/:id	Update a todo
DELETE	/:id	Delete a todo
Create Todo Example
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}

🛡️ Authentication Flow

User signs up → password hashed

User logs in → JWT token issued

User sends token in headers

Authorization: Bearer <token>


Middleware validates token → allows access to CRUD routes

📦 Scripts
Command	Description
npm run dev	Run development with nodemon
npm run build	Build TypeScript to JS
npm start	Start production server
🧪 Future Enhancements

Add refresh token mechanism

Add due dates & reminders

Add priority levels

Add user profile API

Deploy on Render/Netlify/Vercel

🤝 Contributions

Contributions, issues, and feature requests are welcome!

⭐ Show Support

If you like this project, give it a ⭐ on GitHub
