const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Post = require("./models/Post");
const postRoutes = require("./routes/postRoutes");
dotenv.config();

const PORT = process.env.PORT || 5002;

app.use(express.json());

// Call the Database
connectDB();

// Endpoint home - Health Check
app.get("/", (req, res) => {
  res.send({ message: "Forum API KADA Is Running!" });
});

app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log("Port is running on ", PORT);
});
