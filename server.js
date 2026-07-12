const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const Post = require("./models/Post");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
dotenv.config();

const PORT = process.env.PORT || 5002;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Call the Database
connectDB();

// Endpoint home - Health Check
app.get("/", (req, res) => {
  res.send({ message: "Forum API KADA Is Running!" });
});

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

app.listen(PORT, () => {
  console.log("Port is running on ", PORT);
});
