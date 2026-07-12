const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "General",
        "Web Dev",
        "AI/ML",
        "Devops",
        "DevOps",
        "UI/UX",
        "Q&A",
        "Project",
      ],
      default: "General",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
