const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getNotifications = async (token) => {
  const response = await fetch(`${API_BASE}/announcements/notifications/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch notifications");
  return await response.json();
};

export const markNotificationRead = async (id, token) => {
  const response = await fetch(
    `${API_BASE}/announcements/notifications/${id}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }),
    }
  );
  if (!response.ok) throw new Error("Failed to mark notification as read");
  return await response.json();
};
