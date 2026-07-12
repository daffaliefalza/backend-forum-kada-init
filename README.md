# KADA Forum - Documentation

> **Korea-ASEAN Digital Academy Discussion Board**
> A full-stack forum application for KADA bootcamp students to share knowledge, ask questions, and discuss tech topics.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Setup Instructions](#2-setup-instructions)
3. [Database Schema](#3-database-schema)
4. [Authentication Flow](#4-authentication-flow)
5. [API Reference](#5-api-reference)
6. [Code Walkthrough](#6-code-walkthrough)
7. [Frontend Architecture](#7-frontend-architecture)

---

## 1. Project Overview

### What is KADA Forum?

KADA Forum is a **discussion board** where bootcamp students can:

- Create accounts and log in
- Post discussions in different categories (Web Dev, AI/ML, DevOps, etc.)
- Comment on posts and reply to other comments
- Edit and delete their own posts and comments

### Tech Stack

| Layer        | Technology             | Version |
| ------------ | ---------------------- | ------- |
| **Frontend** | React + Vite           | 19.x    |
| **Routing**  | React Router DOM       | 7.x     |
| **Backend**  | Node.js + Express      | 5.x     |
| **Database** | MongoDB + Mongoose     | 9.x     |
| **Auth**     | JWT + bcryptjs         | -       |
| **Google OAuth** | @react-oauth/google + google-auth-library | - |
| **Styling**  | Custom CSS (Variables) | -       |

### Architecture Pattern: MVC

This project follows the **MVC (Model-View-Controller)** pattern:

```
User Action (e.g. click "Create Post")
       |
       v
   [ROUTE]        -->  Receives the HTTP request
       |
       v
 [CONTROLLER]     -->  Handles the business logic
       |
       v
    [MODEL]       -->  Interacts with MongoDB
       |
       v
   [DATABASE]     -->  Stores/retrieves data
       |
       v
   [RESPONSE]     -->  Sends data back to the user
```

### Folder Structure

```
kada-forum/
|
|-- config/
|   |-- db.js                 # MongoDB connection setup
|
|-- models/
|   |-- User.js               # User schema (name, email, password, googleId)
|   |-- Post.js               # Post schema (title, content, category, author)
|   |-- Comment.js            # Comment schema (content, author, post, parentComment)
|
|-- controllers/
|   |-- authController.js     # Register, Login, Logout, Profile, Google OAuth logic
|   |-- postController.js     # Create, Read, Update, Delete posts
|   |-- commentController.js  # Create, Read, Update, Delete comments
|
|-- routes/
|   |-- authRoutes.js         # Auth API endpoints
|   |-- postRoutes.js         # Post API endpoints
|   |-- commentRoutes.js      # Comment API endpoints
|
|-- middleware/
|   |-- auth.js               # JWT verification middleware
|
|-- server.js                 # Express app entry point
|-- .env                      # Environment variables (not in git)
|-- .env.example              # Template for .env
|-- package.json              # Backend dependencies
|
|-- frontend/                 # React application
    |-- src/
    |   |-- api/              # API fetch functions
    |   |   |-- auth.js
    |   |   |-- posts.js
    |   |   |-- comments.js
    |   |-- components/
    |   |   |-- Navbar.jsx
    |   |   |-- Footer.jsx
    |   |-- pages/
    |   |   |-- Home.jsx
    |   |   |-- Posts.jsx
    |   |   |-- Login.jsx
    |   |   |-- Register.jsx
    |   |-- App.jsx           # Main app with routing
    |   |-- main.jsx          # React entry point
    |   |-- App.css           # All styles
    |-- package.json
    |-- vite.config.js
```

---

## 2. Setup Instructions

### Prerequisites

Before you start, make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud account)
- A code editor (VS Code recommended)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd kada-forum
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the **root folder** (kada-forum/):

```env
PORT=5002
MONGO_URI=mongodb://localhost:27017/kada-forum
JWT_SECRET=your_super_secret_key_here
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

> **What do these mean?**
>
> - `PORT` - The port your backend server runs on
> - `MONGO_URI` - Your MongoDB connection string
> - `JWT_SECRET` - A secret key for signing JWT tokens (use a long random string)
> - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID (from Google Cloud Console)

### Step 3: Install Backend Dependencies

```bash
# From the root folder (kada-forum/)
npm install
```

### Step 4: Set Up Frontend Environment

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5002
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

Then install frontend dependencies:

```bash
cd frontend
npm install
```

### Step 5: Start the Application

Open **two terminal windows**:

**Terminal 1 - Backend:**

```bash
# From kada-forum/
node server.js
# You should see: "Port is running on 5002"
# You should see: "Database connected localhost"
```

**Terminal 2 - Frontend:**

```bash
# From kada-forum/frontend/
npm run dev
# You should see: "Local: http://localhost:5173"
```

### Step 6: Open in Browser

Go to `http://localhost:5173` - you should see the KADA Forum homepage!

---

## 3. Database Schema

This project uses **MongoDB** with **Mongoose** (an ODM library that helps you interact with MongoDB using JavaScript objects).

### User Model

**File:** `models/User.js`

```
+------------------+----------+------------------------------------------+
| Field            | Type     | Rules                                    |
+------------------+----------+------------------------------------------+
| name             | String   | Required                                 |
| email            | String   | Required, Unique, Lowercase              |
| password         | String   | Required for manual registration*, Min 6 |
| googleId         | String   | Default: null                            |
| createdAt        | Date     | Auto-generated (from timestamps: true)   |
| updatedAt        | Date     | Auto-generated (from timestamps: true)   |
+------------------+----------+------------------------------------------+
```

\* Password is only required when registering with email/password. Google OAuth users don't need a password.

**What it represents:** A registered user of the forum.

### Post Model

**File:** `models/Post.js`

```
+------------------+----------+------------------------------------------+
| Field            | Type     | Rules                                    |
+------------------+----------+------------------------------------------+
| title            | String   | Required, Trimmed, Max 200 characters    |
| content          | String   | Required                                 |
| category         | String   | Required, Enum (see below), Default: "General" |
| author           | ObjectId | Required, Reference -> User              |
| createdAt        | Date     | Auto-generated                           |
| updatedAt        | Date     | Auto-generated                           |
+------------------+----------+------------------------------------------+
```

**Allowed Categories:**

- General
- Web Dev
- AI/ML
- DevOps / Devops
- UI/UX
- Q&A
- Project

**What it represents:** A discussion post created by a user.

### Comment Model

**File:** `models/Comment.js`

```
+------------------+----------+------------------------------------------+
| Field            | Type     | Rules                                    |
+------------------+----------+------------------------------------------+
| content          | String   | Required, Trimmed                        |
| author           | ObjectId | Required, Reference -> User              |
| post             | ObjectId | Required, Reference -> Post              |
| parentComment    | ObjectId | Optional, Reference -> Comment (default: null) |
| createdAt        | Date     | Auto-generated                           |
| updatedAt        | Date     | Auto-generated                           |
+------------------+----------+------------------------------------------+
```

**What it represents:** A comment on a post. If `parentComment` is `null`, it is a top-level comment. If `parentComment` has a value, it is a **reply** to another comment.

### Relationship Diagram

```
  [User] 1 --- * [Post]
    |               |
    |               |
    +--- * [Comment] * ---+
         (self-referencing via parentComment for replies)
```

- One User can create **many** Posts
- One User can create **many** Comments
- One Post can have **many** Comments
- One Comment can have **many** Replies (other Comments with `parentComment` pointing to it)

---

## 4. Authentication Flow

This project uses **JWT (JSON Web Tokens)** stored in **HTTP-only cookies** for authentication.

### What is JWT?

JWT is a special token that the server creates after a user logs in. The token contains the user's ID and is signed with a secret key. The server can later verify this token to know who the user is.

### Step-by-Step Flow

#### Registration

```
1. User fills in name, email, password
          |
2. Frontend sends POST /api/auth/register
          |
3. Backend checks if email already exists
          |
4. Backend hashes password with bcryptjs (10 salt rounds)
          |
5. Backend creates User in MongoDB
          |
6. Backend generates JWT token (contains user ID, expires in 30 days)
          |
7. Backend sets token in HTTP-only cookie
          |
8. Backend sends back user info (name, email, _id)
          |
9. Frontend receives data, stores user in state
```

#### Login

```
1. User enters email and password
          |
2. Frontend sends POST /api/auth/login
          |
3. Backend finds user by email
          |
4. Backend compares password with bcrypt
          |
5. If match: generate JWT, set cookie, return user info
          |
6. If no match: return error "Invalid email or password"
```

#### Staying Logged In (Session Check)

```
1. Frontend loads App component
          |
2. useEffect calls getMe() -> GET /api/auth/me
          |
3. Backend middleware reads token from cookies
          |
4. Backend verifies token, finds user in DB
          |
5. Returns user info -> Frontend sets user state
          |
6. Navbar shows "Hello, [name]" instead of Login link
```

#### Logout

```
1. User clicks "Logout" button
          |
2. Frontend sends POST /api/auth/logout
          |
3. Backend clears the token cookie
          |
4. Frontend sets user state to null
          |
5. Navbar shows Login link again
```

#### Google OAuth

```
1. User clicks "Sign in with Google"
          |
2. Google popup opens, user authenticates
          |
3. Google returns credential (ID token)
          |
4. Frontend sends POST /api/auth/google { credential }
          |
5. Backend verifies token with google-auth-library
          |
6. Backend finds or creates user by googleId/email
          |
7. Backend generates JWT, sets cookie
          |
8. User is logged in!
```

**Key points:**
- Google users are identified by their `googleId` (the `sub` field from Google's token)
- If a user with the same email already exists, the Google account is linked to it
- Google users don't need a password - the `password` field is optional for them

### The protect Middleware

**File:** `middleware/auth.js`

This is a gatekeeper function. Any route that uses `protect` will:

1. Check if a `token` cookie exists
2. If no token -> return 401 "Not authorized"
3. Verify the token using `jwt.verify()`
4. Find the user in the database (without password)
5. Attach user info to `req.user`
6. Call `next()` to let the route handler run

**Example usage in routes:**

```javascript
// Anyone can access this route
router.get("/", getPosts);

// Only logged-in users can access this route
router.post("/", protect, createPost);
```

### Security Features

- **HTTP-only cookies**: JavaScript cannot read the token (prevents XSS attacks)
- **SameSite=strict**: Cookie only sent to same site (prevents CSRF)
- **bcryptjs hashing**: Passwords are never stored in plain text
- **Password excluded**: The `select("-password")` ensures the password is never sent back in responses

---

## 5. API Reference

The backend runs on `http://localhost:5002`. All endpoints below are relative to this base URL.

---

### Auth Endpoints

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response (201):**

```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d0",
  "name": "John",
  "email": "john@example.com"
}
```

**Error Response (400):**

```json
{
  "message": "User already exist"
}
```

---

#### POST `/api/auth/login`

Log in an existing user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response (201):**

```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d0",
  "name": "John",
  "email": "john@example.com"
}
```

**Error Response (401):**

```json
{
  "message": "Invalid email or password"
}
```

---

#### GET `/api/auth/me`

Get the currently logged-in user's profile.

**Auth Required:** Yes (cookie)

**Success Response (200):**

```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d0",
  "name": "John",
  "email": "john@example.com"
}
```

---

#### POST `/api/auth/logout`

Clear the authentication cookie.

**Success Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

---

#### POST `/api/auth/google`

Log in or register using Google OAuth.

**Request Body:**

```json
{
  "credential": "<Google_ID_Token>"
}
```

**Success Response (201):**

```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d0",
  "name": "John",
  "email": "john@gmail.com"
}
```

**Error Response (400):**

```json
{
  "message": "Google authentication failed"
}
```

---

### Post Endpoints

#### GET `/api/posts`

Get all posts, sorted by newest first.

**Auth Required:** No

**Success Response (200):**

```json
[
  {
    "_id": "6650b2c3d4e5f6a7b8c9d0e1",
    "title": "How to learn React?",
    "content": "I'm a beginner and want to learn React...",
    "category": "Web Dev",
    "author": {
      "_id": "6650a1b2c3d4e5f6a7b8c9d0",
      "name": "John"
    },
    "createdAt": "2026-07-10T10:30:00.000Z",
    "updatedAt": "2026-07-10T10:30:00.000Z"
  }
]
```

---

#### GET `/api/posts/:id`

Get a single post by its ID.

**Auth Required:** No

**Success Response (200):**

```json
{
  "_id": "6650b2c3d4e5f6a7b8c9d0e1",
  "title": "How to learn React?",
  "content": "I'm a beginner and want to learn React...",
  "category": "Web Dev",
  "author": {
    "_id": "6650a1b2c3d4e5f6a7b8c9d0",
    "name": "John"
  },
  "createdAt": "2026-07-10T10:30:00.000Z",
  "updatedAt": "2026-07-10T10:30:00.000Z"
}
```

---

#### POST `/api/posts`

Create a new post.

**Auth Required:** Yes (cookie)

**Request Body:**

```json
{
  "title": "How to learn React?",
  "content": "I'm a beginner and want to learn React...",
  "category": "Web Dev"
}
```

**Success Response (201):**

```json
{
  "_id": "6650b2c3d4e5f6a7b8c9d0e1",
  "title": "How to learn React?",
  "content": "I'm a beginner and want to learn React...",
  "category": "Web Dev",
  "author": {
    "_id": "6650a1b2c3d4e5f6a7b8c9d0",
    "name": "John"
  },
  "createdAt": "2026-07-10T10:30:00.000Z",
  "updatedAt": "2026-07-10T10:30:00.000Z"
}
```

---

#### PUT `/api/posts/:id`

Update a post. Only the author can update their own post.

**Auth Required:** Yes (cookie)

**Request Body:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "AI/ML"
}
```

**Success Response (200):** Returns the updated post.

**Error Response (403):**

```json
{
  "message": "Not authorized to update this post"
}
```

---

#### DELETE `/api/posts/:id`

Delete a post. Only the author can delete their own post.

**Auth Required:** Yes (cookie)

**Success Response (200):**

```json
{
  "id": "6650b2c3d4e5f6a7b8c9d0e1",
  "message": "Post deleted"
}
```

---

### Comment Endpoints

#### GET `/api/comments/counts`

Get the number of comments for each post.

**Auth Required:** No

**Success Response (200):**

```json
{
  "6650b2c3d4e5f6a7b8c9d0e1": 5,
  "6650b2c3d4e5f6a7b8c9d0e2": 2
}
```

---

#### GET `/api/comments/post/:postId`

Get all comments for a specific post, organized as top-level comments with nested replies.

**Auth Required:** No

**Success Response (200):**

```json
[
  {
    "_id": "comment1",
    "content": "Great post!",
    "author": { "_id": "user1", "name": "Jane" },
    "post": "6650b2c3d4e5f6a7b8c9d0e1",
    "parentComment": null,
    "createdAt": "2026-07-10T12:00:00.000Z",
    "replies": [
      {
        "_id": "reply1",
        "content": "Thanks!",
        "author": { "_id": "user2", "name": "John" },
        "parentComment": "comment1",
        "createdAt": "2026-07-10T12:30:00.000Z"
      }
    ]
  }
]
```

---

#### POST `/api/comments/post/:postId`

Create a new comment or reply on a post.

**Auth Required:** Yes (cookie)

**Request Body (New Comment):**

```json
{
  "content": "Great post!"
}
```

**Request Body (Reply to a Comment):**

```json
{
  "content": "Thanks for sharing!",
  "parentComment": "6650c3d4e5f6a7b8c9d0e1f2"
}
```

**Success Response (201):** Returns the created comment with populated author.

---

#### PUT `/api/comments/:id`

Update a comment. Only the author can update.

**Auth Required:** Yes (cookie)

**Request Body:**

```json
{
  "content": "Updated comment text"
}
```

---

#### DELETE `/api/comments/:id`

Delete a comment. Only the author can delete. If the comment has replies, they are also deleted.

**Auth Required:** Yes (cookie)

**Success Response (200):**

```json
{
  "id": "6650c3d4e5f6a7b8c9d0e1f2",
  "message": "Comment deleted"
}
```

---

## 6. Code Walkthrough

In this section, we will go through every file and explain what it does.

---

### Backend Files

---

#### `server.js` - The Entry Point

This is the **main file** that starts everything. It:

1. Creates an Express application
2. Loads environment variables from `.env`
3. Configures CORS (allows the frontend at port 5173 to talk to the backend at port 5002)
4. Sets up middleware for JSON parsing and cookies
5. Connects to MongoDB
6. Defines the home/health-check endpoint
7. Mounts the route groups
8. Starts listening on the configured port

```javascript
// This line tells Express: "When someone visits /api/posts, use the postRoutes"
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
```

**Key concept:** `app.use()` is how Express "mounts" routers. Think of it as assigning different "teams" to handle different URL paths.

---

#### `config/db.js` - Database Connection

This file exports a single async function that connects to MongoDB using Mongoose.

```javascript
const conn = await mongoose.connect(process.env.MONGO_URI);
```

If the connection fails, it logs the error and exits the process with `process.exit(1)`.

---

#### `models/User.js` - User Schema

Defines the structure of a user document in MongoDB:

- `name` - The user's display name
- `email` - Unique identifier for login, automatically lowercased
- `password` - Hashed password, minimum 6 characters
- `timestamps: true` - Automatically adds `createdAt` and `updatedAt` fields

**Important:** The password is never stored in plain text. It is hashed by `authController.js` before saving.

---

#### `models/Post.js` - Post Schema

Defines a discussion post:

- `title` - Post headline (max 200 characters)
- `content` - The main body of the post
- `category` - One of the allowed categories (enum validates this)
- `author` - References the User who created it (`ref: "User"`)

**What does `ref: "User"` do?** It tells Mongoose that this field stores a User's `_id`. Later, we can use `.populate("author", "name")` to automatically replace the ID with the actual user's name.

---

#### `models/Comment.js` - Comment Schema

Defines a comment on a post:

- `content` - The comment text
- `author` - References the User who wrote it
- `post` - References the Post this comment belongs to
- `parentComment` - If `null`, it is a top-level comment. If it has a value, it is a **reply** to another comment

**Self-referencing pattern:** The `parentComment` field points to another Comment. This is how we create nested reply threads.

---

#### `middleware/auth.js` - Authentication Middleware

This is a **gatekeeper** function used to protect routes.

**How it works:**

```
Request comes in with cookie "token=eyJhbG..."
        |
1. Read token from req.cookies.token
        |
2. No token? -> Return 401 "Not authorized"
        |
3. Verify token: jwt.verify(token, JWT_SECRET)
        |
4. Invalid token? -> Return 401 "token failed"
        |
5. Find user in DB by decoded.id (without password)
        |
6. No user found? -> Return 401 "user not found"
        |
7. Attach user to req.user
        |
8. Call next() -> Route handler runs
```

---

#### `controllers/authController.js` - Auth Logic

Contains five functions:

| Function      | Purpose                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| `register`    | Validates input, checks if email exists, hashes password, creates user, returns token |
| `login`       | Finds user by email, compares password, returns token                                 |
| `getMe`       | Returns the current user's info from `req.user`                                       |
| `logout`      | Clears the token cookie                                                               |
| `googleLogin` | Verifies Google ID token, finds/creates user, returns token                           |

**Helper functions:**

- `generateToken(id)` - Creates a JWT with the user's ID, expires in 30 days
- `setTokenCookie(res, token)` - Sets the JWT in an HTTP-only cookie

---

#### `controllers/postController.js` - Post Logic

Contains five CRUD functions:

| Function     | What it does                                            |
| ------------ | ------------------------------------------------------- |
| `getPosts`   | Finds all posts, populates author name, sorts by newest |
| `getPost`    | Finds one post by ID, populates author name             |
| `createPost` | Creates a new post using `req.user.id` as the author    |
| `updatePost` | Checks ownership, then updates the post                 |
| `deletePost` | Checks ownership, then deletes the post                 |

**Ownership check pattern:**

```javascript
if (post.author.toString() !== req.user.id) {
  return res.status(403).json({ message: "Not authorized" });
}
```

This ensures only the person who created a post can edit or delete it.

---

#### `controllers/commentController.js` - Comment Logic

Contains five functions:

| Function            | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `getCommentCounts`  | Uses MongoDB aggregation to count comments per post |
| `getCommentsByPost` | Fetches comments for a post and nests replies       |
| `createComment`     | Creates a comment (top-level or reply)              |
| `updateComment`     | Checks ownership, then updates                      |
| `deleteComment`     | Checks ownership, deletes comment and its replies   |

**Nesting replies:**

```javascript
const topLevel = comments.filter((c) => !c.parentComment);
const replies = comments.filter((c) => c.parentComment);

const nested = topLevel.map((comment) => ({
  ...comment.toObject(),
  replies: replies.filter(
    (r) => r.parentComment.toString() === comment._id.toString(),
  ),
}));
```

This separates top-level comments from replies, then attaches replies to their parent.

---

#### `routes/authRoutes.js` - Auth Endpoints

Maps HTTP methods and paths to controller functions:

```javascript
router.post("/register", register);   // No auth needed
router.post("/login", login);         // No auth needed
router.get("/me", protect, getMe);    // Auth required
router.post("/logout", logout);       // No auth needed
router.post("/google", googleLogin);  // No auth needed (Google handles auth)
```

---

#### `routes/postRoutes.js` - Post Endpoints

```javascript
router.get("/", getPosts); // No auth needed
router.get("/:id", getPost); // No auth needed
router.post("/", protect, createPost); // Auth required
router.put("/:id", protect, updatePost); // Auth required
router.delete("/:id", protect, deletePost); // Auth required
```

---

#### `routes/commentRoutes.js` - Comment Endpoints

```javascript
router.get("/counts", getCommentCounts); // No auth
router.get("/post/:postId", getCommentsByPost); // No auth
router.post("/post/:postId", protect, createComment); // Auth required
router.put("/:id", protect, updateComment); // Auth required
router.delete("/:id", protect, deleteComment); // Auth required
```

**Note:** The `/counts` route must come before `/:id` routes, otherwise Express would treat "counts" as an ID.

---

### Frontend Files

---

#### `frontend/src/main.jsx` - React Entry Point

This is where React "attaches" itself to the HTML page. It wraps the `<App />` component in a `GoogleOAuthProvider` for Google Sign-In, then renders it into the `<div id="root">` in `index.html`.

```javascript
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
```

---

#### `frontend/src/App.jsx` - Main App Component

This is the **root component** that orchestrates the entire application.

**What it does:**

1. Manages the `user` state (null if not logged in, user object if logged in)
2. On mount, calls `getMe()` to check if the user is already logged in (via cookie)
3. Defines `handleLogout` to log out and clear user state
4. Sets up routing with React Router

**Routes:**

```javascript
"/"        -> <Home />        (Landing page)
"/posts"   -> <Posts />       (Forum posts)
"/login"   -> <Login />       (Login form)
"/register" -> <Register />   (Register form)
```

**Props drilling:** The `user` state and `handleLogout` function are passed down to child components as props.

---

#### `frontend/src/api/auth.js` - Auth API Functions

Contains five functions that make HTTP requests to the backend auth endpoints:

| Function         | Method | Endpoint             | Purpose         |
| ---------------- | ------ | -------------------- | --------------- |
| `registerUser`   | POST   | `/api/auth/register` | Register        |
| `loginUser`      | POST   | `/api/auth/login`    | Login           |
| `getMe`          | GET    | `/api/auth/me`       | Check session   |
| `logoutUser`     | POST   | `/api/auth/logout`   | Logout          |
| `googleLoginUser`| POST   | `/api/auth/google`   | Google OAuth    |

**Key detail:** All requests include `credentials: "include"` to send the HTTP-only cookie with the request.

---

#### `frontend/src/api/posts.js` - Post API Functions

Contains five CRUD functions:

| Function     | Method | Endpoint         | Purpose        |
| ------------ | ------ | ---------------- | -------------- |
| `fetchPosts` | GET    | `/api/posts`     | List all posts |
| `getPost`    | GET    | `/api/posts/:id` | Get one post   |
| `createPost` | POST   | `/api/posts`     | Create post    |
| `updatePost` | PUT    | `/api/posts/:id` | Update post    |
| `deletePost` | DELETE | `/api/posts/:id` | Delete post    |

---

#### `frontend/src/api/comments.js` - Comment API Functions

| Function             | Method | Endpoint                     | Purpose        |
| -------------------- | ------ | ---------------------------- | -------------- |
| `fetchCommentCounts` | GET    | `/api/comments/counts`       | Count per post |
| `fetchComments`      | GET    | `/api/comments/post/:postId` | Get comments   |
| `createComment`      | POST   | `/api/comments/post/:postId` | Create comment |
| `deleteComment`      | DELETE | `/api/comments/:id`          | Delete comment |

---

#### `frontend/src/components/Navbar.jsx` - Navigation Bar

A sticky navigation bar at the top of every page.

**What it shows:**

- Always: "KADA Forum" brand link, "Posts" link
- If logged in: "Hello, [name]" text, "Logout" button
- If not logged in: "Login" link

---

#### `frontend/src/components/Footer.jsx` - Footer

A simple footer displaying "2026 KADA Forum. Korea-ASEAN Digital Academy."

---

#### `frontend/src/pages/Home.jsx` - Landing Page

A welcome page with:

- Hero section with title and description
- "Browse Posts" button
- Three feature cards: Share Knowledge, Learn Together, Build Network

---

#### `frontend/src/pages/Login.jsx` - Login Page

A login form with:

- Email input
- Password input
- Submit button
- "or" divider
- Google Sign-In button
- Link to Register page

**Flow (Email/Password):**

1. User submits form
2. Calls `loginUser()` API function
3. On success, calls `onLogin()` (which triggers `fetchUser` in App.jsx)
4. Navigates to `/posts`

**Flow (Google):**

1. User clicks "Sign in with Google"
2. Google popup opens, user authenticates
3. Calls `googleLoginUser()` with the credential
4. On success, calls `onLogin()` and navigates to `/posts`

---

#### `frontend/src/pages/Register.jsx` - Register Page

A registration form with:

- Name input
- Email input
- Password input
- Submit button
- "or" divider
- Google Sign-In button
- Link to Login page

**Flow:** Same as Login, but calls `registerUser()` instead. Google OAuth works the same way on both pages.

---

#### `frontend/src/pages/Posts.jsx` - Posts Page (Main Feature)

This is the **most complex component** in the application. It handles:

1. **Fetching and displaying all posts**
2. **Creating new posts** (with a toggle form)
3. **Editing posts** (inline edit form, owners only)
4. **Deleting posts** (with confirmation, owners only)
5. **Comment counts** for each post
6. **Expanding/collapsing comments** per post
7. **Creating comments** (logged-in users)
8. **Replying to comments** (nested replies)
9. **Deleting comments and replies** (owners only)

**State Variables:**

```javascript
posts; // Array of all posts
loading; // true while fetching
showForm; // true when create form is visible
editingPost; // ID of post being edited
comments; // Object: { postId: [comments] }
commentCounts; // Object: { postId: count }
showComments; // ID of post whose comments are expanded
commentText; // Current comment input value
replyingTo; // ID of comment being replied to
replyText; // Current reply input value
```

**Category colors:**

```javascript
General: #6b7280 (gray)
Web Dev: #3b82f6 (blue)
AI/ML: #8b5cf6 (purple)
DevOps: #10b981 (green)
UI/UX: #ec4899 (pink)
Q&A: #f59e0b (amber)
Project: #ef4444 (red)
```

---

## 7. Frontend Architecture

### Component Tree

```
<App>
  |
  +-- <Navbar>              (sticky, always visible)
  |
  +-- <Routes>
  |     |
  |     +-- "/"           -> <Home>
  |     +-- "/posts"      -> <Posts>
  |     +-- "/login"      -> <Login>
  |     +-- "/register"   -> <Register>
  |
  +-- <Footer>             (always visible)
```

### State Management

This project uses **React's built-in useState** for state management (no external state library).

**Global state** (in `App.jsx`):

- `user` - The logged-in user's info (or null)

**Page-level state** (in `Posts.jsx`):

- `posts`, `loading`, `error`
- `showForm`, `title`, `content`, `category`
- `editingPost`, `editTitle`, `editContent`, `editCategory`
- `comments`, `commentCounts`, `showComments`
- `commentText`, `replyingTo`, `replyText`

### Data Flow Diagram

```
+-------------------+
|    App.jsx        |
|  (user state)     |
+--------+----------+
         |
    props (user, onLogout)
         |
+--------v----------+     fetch()      +-------------------+
|    Navbar.jsx     | <--------------> | Backend API       |
+-------------------+                   +-------------------+

+-------------------+
|    Posts.jsx      |     fetch()      +-------------------+
| (posts, comments) | <--------------> | /api/posts        |
|                   |                   | /api/comments     |
+-------------------+                   +-------------------+
```

### Routing

The project uses **React Router DOM v7** for client-side routing.

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/posts" element={<Posts user={user} />} />
    <Route path="/login" element={<Login onLogin={fetchUser} />} />
    <Route path="/register" element={<Register onRegister={fetchUser} />} />
  </Routes>
</BrowserRouter>
```

**How it works:**

- `<BrowserRouter>` provides routing context
- `<Routes>` matches the current URL to a `<Route>`
- Each `<Route>` renders a page component
- `<Link>` components navigate without page reloads

### API Integration Pattern

Every API function follows the same pattern:

```javascript
export const functionName = async (params) => {
  const res = await fetch(URL, {
    method: "GET",        // or POST, PUT, DELETE
    headers: { ... },     // for POST/PUT
    credentials: "include", // always include cookies
    body: JSON.stringify(data), // for POST/PUT
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message); // error goes to React state
  }

  return res.json(); // success goes to React state
};
```

### CSS Architecture

All styles are in a single file: `frontend/src/App.css`

**CSS Custom Properties (Variables):**

```css
:root {
  --primary: #0f766e; /* Main green color */
  --text: #17212b; /* Dark text */
  --muted: #657282; /* Gray text */
  --border: #e1e7ee; /* Border color */
  --danger: #dc2626; /* Red for delete */
  --radius: 8px; /* Border radius */
}
```

**Responsive breakpoints:**

- `760px` - Tablet
- `640px` - Small tablet
- `460px` - Mobile

---

## Key Takeaways for Bootcamp Students

1. **Separation of concerns** - Backend handles data and logic, frontend handles display and user interaction
2. **REST API pattern** - Use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations
3. **Authentication vs Authorization** - Auth = "who are you?" (login), Authz = "what can you do?" (permissions)
4. **Middleware pattern** - Functions that run before route handlers (like security guards)
5. **Population** - Mongoose's way of joining collections (like SQL JOINs)
6. **HTTP-only cookies** - Safer than storing tokens in localStorage
7. **Component composition** - Build complex UIs by combining small, reusable components
8. **State lifting** - When components need to share data, lift state to their common parent

---

> **Built with Love, by KADA Bootcamp Team Elice - Andi Daffa Liefalza**
> Korea-ASEAN Digital Academy - Batch 4
