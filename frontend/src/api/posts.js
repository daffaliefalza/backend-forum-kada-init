const API_URL = `${import.meta.env.VITE_API_URL}/api/posts`;

// Get all posts
export const fetchPosts = async () => {
  const res = await fetch(API_URL, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
};

// Get single post
export const getPost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }
  return res.json();
};

// Create new post
export const createPost = async (postData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to create post");
  }
  return res.json();
};

// Update post
export const updatePost = async (id, postData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update post");
  }
  return res.json();
};

// Delete post
export const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete post");
  }
  return res.json();
};
