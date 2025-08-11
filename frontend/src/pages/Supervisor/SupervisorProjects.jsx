import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getProjects,
  createProject,
  getProposals,
} from "../../services/proposals";

const SupervisorProjects = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState({
    proposal_id: "",
    title: "",
    description: "",
    students: [],
    start_date: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
      fetchProposals();
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

  const fetchProposals = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getProposals(token);
      setProposals(data.filter((p) => p.status === "approved"));
    } catch (err) {
      setError("Failed to load proposals");
    }
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "students") {
      setForm((prev) => ({
        ...prev,
        students: Array.from(options)
          .filter((o) => o.selected)
          .map((o) => o.value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await createProject(form, token);
      setSuccess("Project created successfully!");
      setForm({
        proposal_id: "",
        title: "",
        description: "",
        students: [],
        start_date: "",
        end_date: "",
      });
      fetchProjects();
    } catch (err) {
      setError("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "supervisor")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Approved Proposal
            </label>
            <select
              name="proposal_id"
              value={form.proposal_id}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select proposal</option>
              {proposals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.student})
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
              required
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Assign Students</label>
            <select
              name="students"
              multiple
              value={form.students}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded p-2"
            >
              {proposals
                .filter((p) => p.id === parseInt(form.proposal_id))
                .flatMap((p) => [p.student])
                .map((student, idx) => (
                  <option key={idx} value={student}>
                    {student}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded p-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Assigned Projects</h3>
        {projects.length === 0 ? (
          <p>No projects assigned to you yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Students</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.status}</td>
                  <td>{p.students && p.students.join(", ")}</td>
                  <td>{p.start_date || "-"}</td>
                  <td>{p.end_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupervisorProjects;
