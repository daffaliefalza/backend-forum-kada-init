const express = require("express");
const router = express.Router();
const {
  getCommentCounts,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

// GET /api/comments/counts - Get comment counts for all posts
router.get("/counts", getCommentCounts);

// GET /api/comments/post/:postId - Get comments for a post
router.get("/post/:postId", getCommentsByPost);

// POST /api/comments/post/:postId - Create comment (protected)
router.post("/post/:postId", protect, createComment);

// PUT /api/comments/:id - Update comment (protected)
router.put("/:id", protect, updateComment);

// DELETE /api/comments/:id - Delete comment (protected)
router.delete("/:id", protect, deleteComment);

module.exports = router;
