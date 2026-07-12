const Comment = require("../models/Comment");

const getCommentCounts = async (req, res) => {
  try {
    const counts = await Comment.aggregate([
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const result = {};
    counts.forEach((c) => {
      result[c._id] = c.count;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    // Separate top-level comments and replies
    const topLevel = comments.filter((c) => !c.parentComment);
    const replies = comments.filter((c) => c.parentComment);

    // Attach replies to their parent comments
    const nested = topLevel.map((comment) => ({
      ...comment.toObject(),
      replies: replies.filter(
        (r) => r.parentComment.toString() === comment._id.toString(),
      ),
    }));

    res.json(nested);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null,
    });

    const populatedComment = await comment.populate("author", "name");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true },
    ).populate("author", "name");

    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete replies if this is a parent comment
    if (!comment.parentComment) {
      await Comment.deleteMany({ parentComment: req.params.id });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByPost,
  getCommentCounts,
  createComment,
  updateComment,
  deleteComment,
};
