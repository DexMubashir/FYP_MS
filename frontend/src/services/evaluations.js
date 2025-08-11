const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getRubrics = async (token) => {
  const response = await fetch(`${API_BASE}/evaluations/rubrics/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch rubrics");
  return await response.json();
};

export const getEvaluations = async (token, projectId = null) => {
  let url = `${API_BASE}/evaluations/evaluations/`;
  if (projectId) url += `?project=${projectId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch evaluations");
  return await response.json();
};

export const submitEvaluation = async (data, token) => {
  const response = await fetch(`${API_BASE}/evaluations/evaluations/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit evaluation");
  return await response.json();
};
