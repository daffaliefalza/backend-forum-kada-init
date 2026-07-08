import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts, createPost, updatePost, deletePost } from "../api/posts";

const CATEGORIES = [
  "General",
  "Web Dev",
  "AI/ML",
  "DevOps",
  "UI/UX",
  "Q&A",
  "Project",
];

function Posts({ user }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");

  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("General");

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await createPost({ title, content, category });
      setTitle("");
      setContent("");
      setCategory("General");
      setShowForm(false);
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("General");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editTitle.trim() || !editContent.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await updatePost(editingPost, {
        title: editTitle,
        content: editContent,
        category: editCategory,
      });
      handleCancelEdit();
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost(id);
      loadPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (cat) => {
    const colors = {
      General: "#6b7280",
      "Web Dev": "#3b82f6",
      "AI/ML": "#8b5cf6",
      DevOps: "#10b981",
      "UI/UX": "#ec4899",
      "Q&A": "#f59e0b",
      Project: "#ef4444",
    };
    return colors[cat] || "#6b7280";
  };

  return (
    <div className="posts-page">
      {error && <div className="error-message">{error}</div>}

      {user && !showForm && (
        <button className="btn-toggle" onClick={() => setShowForm(true)}>
          + Create Post
        </button>
      )}

      {!user && (
        <div className="login-prompt">
          <p>
            Please <a href="/login">login</a> to create a post.
          </p>
        </div>
      )}

      {showForm && (
        <div className="create-post">
          <h2>Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows="5"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit">Create Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="post-list">
        <h2>Recent Discussions</h2>
        {loading ? (
          <p className="loading">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="post-list-empty">
            <p>No posts yet. Be the first to create one!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {editingPost === post._id ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label htmlFor="edit-title">Title</label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-category">Category</label>
                    <select
                      id="edit-category"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-content">Content</label>
                    <textarea
                      id="edit-content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="5"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button type="submit">Update</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="post-header">
                    <span
                      className="post-category"
                      style={{
                        backgroundColor: getCategoryColor(post.category),
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="post-date">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-content">{post.content}</p>
                  <div className="post-footer">
                    <span className="post-author">
                      By {post.author?.name || "Unknown"}
                    </span>
                    {user && user._id === post.author?._id && (
                      <div className="post-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Posts;
