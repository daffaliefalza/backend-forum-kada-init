const Post = require("../models/Post");

// Get All Post
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");

    if (!post) {
      res.status(404).json({ message: "Post not found!" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.mesage });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const { title, content, category, author } = req.body;
    const post = await Post.create({
      title,
      content,
      category,
      author: req.user.id,
    });

    const populatedPost = await post.populate("author", "name");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "name");

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Post

// previous version
// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findByIdAndDelete(req.params.id);

//     if (!post) {
//       return res.status(404).json({ message: "Post not freaking found!" });
//     }

//     res.json({ id: req.params.id, message: "Post deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
