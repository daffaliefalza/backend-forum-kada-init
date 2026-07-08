const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Register User
export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }

  return res.json();
};

// Login user
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error("Not authorized");
  }
  return res.json();
};

// Get Current profile
export const getMe = async () => {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authorized");
  }

  return res.json();
};

// Logout
export const logoutUser = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to logout");
  }

  return res.json();
};
