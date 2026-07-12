const API_URL = `${import.meta.env.VITE_API_URL}/api/comments`;

// Get comment counts for all posts
export const fetchCommentCounts = async () => {
  const res = await fetch(`${API_URL}/counts`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch comment counts");
  return res.json();
};

// Get comments for a post
export const fetchComments = async (postId) => {
  const res = await fetch(`${API_URL}/post/${postId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
};

// Create comment
export const createComment = async (postId, content, parentComment = null) => {
  const res = await fetch(`${API_URL}/post/${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content, parentComment }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
};

// Delete comment
export const deleteComment = async (commentId) => {
  const res = await fetch(`${API_URL}/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
};
