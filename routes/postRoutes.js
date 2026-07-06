const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

// Get All Post
router.get("/", getPosts);

// Get Single Post
router.get("/:id", getPost);

// Create post
router.post("/", createPost);

// Update post
router.put("/:id", updatePost);

// Delete Post
router.delete("/:id", deletePost);

module.exports = router;
