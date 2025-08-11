const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getProposals = async (token) => {
  const response = await fetch(`${API_BASE}/fyps/proposals/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch proposals");
  return await response.json();
};

export const submitProposal = async (data, token) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const response = await fetch(`${API_BASE}/fyps/proposals/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to submit proposal");
  return await response.json();
};

export const updateProposal = async (id, data, token) => {
  const response = await fetch(`${API_BASE}/fyps/proposals/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update proposal");
  return await response.json();
};

export const getProjects = async (token) => {
  const response = await fetch(`${API_BASE}/fyps/projects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return await response.json();
};

export const createProject = async (data, token) => {
  const response = await fetch(`${API_BASE}/fyps/projects/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return await response.json();
};

export const updateProject = async (id, data, token) => {
  const response = await fetch(`${API_BASE}/fyps/projects/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return await response.json();
};

export const getMilestones = async (token, projectId = null) => {
  let url = `${API_BASE}/fyps/milestones/`;
  if (projectId) url += `?project=${projectId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch milestones");
  return await response.json();
};

export const createMilestone = async (data, token) => {
  const response = await fetch(`${API_BASE}/fyps/milestones/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create milestone");
  return await response.json();
};

export const updateMilestone = async (id, data, token) => {
  const response = await fetch(`${API_BASE}/fyps/milestones/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update milestone");
  return await response.json();
};

export const getDocuments = async (token, projectId = null) => {
  let url = `${API_BASE}/fyps/documents/`;
  if (projectId) url += `?project=${projectId}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch documents");
  return await response.json();
};

export const uploadDocument = async (data, token) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  const response = await fetch(`${API_BASE}/fyps/documents/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload document");
  return await response.json();
};
