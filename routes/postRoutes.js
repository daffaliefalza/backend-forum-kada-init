const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/auth");

// Get All Post
router.get("/", getPosts);

// Get Single Post
router.get("/:id", getPost);

// Create post
router.post("/", protect, createPost);

// Update post
router.put("/:id", protect, updatePost);

// Delete Post
router.delete("/:id", protect, deletePost);

module.exports = router;
