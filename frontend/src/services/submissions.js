const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getSubmissions = async (token) => {
  const response = await fetch(`${API_BASE}/submissions/submissions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch submissions");
  return await response.json();
};

export const submitSubmission = async (data, token) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const response = await fetch(`${API_BASE}/submissions/submissions/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to submit submission");
  return await response.json();
};

export const getFeedbackThread = async (threadId, token) => {
  const response = await fetch(
    `${API_BASE}/submissions/feedback-threads/${threadId}/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch feedback thread");
  return await response.json();
};

export const postFeedbackMessage = async (data, token) => {
  const response = await fetch(`${API_BASE}/submissions/feedback-messages/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to post feedback message");
  return await response.json();
};
