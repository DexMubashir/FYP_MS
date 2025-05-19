const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return await response.json(); // { access, refresh }
};

export const fetchUserProfile = async (accessToken) => {
  const response = await fetch(`${API_BASE}/users/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await response.json(); // { id, email, first_name, ... }
};
