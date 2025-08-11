import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getProjects,
  getMilestones,
  createMilestone,
  updateMilestone,
} from "../../services/proposals";

const SupervisorMilestones = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [form, setForm] = useState({
    project: "",
    title: "",
    description: "",
    due_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
      fetchMilestones();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

  const fetchProjects = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getProjects(token);
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const fetchMilestones = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getMilestones(token);
      setMilestones(data);
    } catch (err) {
      setError("Failed to load milestones");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await createMilestone(form, token);
      setSuccess("Milestone created successfully!");
      setForm({ project: "", title: "", description: "", due_date: "" });
      fetchMilestones();
    } catch (err) {
      setError("Failed to create milestone");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (milestone) => {
    setEditing(milestone.id);
    setEditForm({
      title: milestone.title,
      description: milestone.description,
      due_date: milestone.due_date,
      status: milestone.status,
      completion_date: milestone.completion_date || "",
    });
  };

  const handleUpdate = async (id) => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await updateMilestone(id, editForm, token);
      setSuccess("Milestone updated successfully!");
      setEditing(null);
      setEditForm({});
      fetchMilestones();
    } catch (err) {
      setError("Failed to update milestone");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "supervisor")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Project Milestones</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">Create New Milestone</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Project</label>
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Milestone"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">All Milestones</h3>
        {milestones.length === 0 ? (
          <p>No milestones found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Project</th>
                <th>Title</th>
                <th>Status</th>
                <th>Due</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id}>
                  <td>
                    {projects.find((p) => p.id === m.project)?.title ||
                      m.project}
                  </td>
                  <td>
                    {editing === m.id ? (
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-24"
                      />
                    ) : (
                      m.title
                    )}
                  </td>
                  <td>
                    {editing === m.id ? (
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="border rounded p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    ) : (
                      m.status
                    )}
                  </td>
                  <td>
                    {editing === m.id ? (
                      <input
                        type="date"
                        name="due_date"
                        value={editForm.due_date}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-28"
                      />
                    ) : (
                      m.due_date
                    )}
                  </td>
                  <td>
                    {editing === m.id ? (
                      <input
                        type="date"
                        name="completion_date"
                        value={editForm.completion_date || ""}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-28"
                      />
                    ) : (
                      m.completion_date || "-"
                    )}
                  </td>
                  <td>
                    {editing === m.id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded mr-1"
                          disabled={submitting}
                          onClick={() => handleUpdate(m.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={() => setEditing(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(m)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupervisorMilestones;
