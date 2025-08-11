import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { submitProposal, getProposals } from "../../services/proposals";

// Sample supervisors list (replace with API call)
const supervisors = [
  { id: 1, name: "Dr. Smith" },
  { id: 2, name: "Dr. Brown" },
  { id: 3, name: "Dr. Lee" },
];

const StudentProposals = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    document: null,
    supervisor: "",
    batch: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [duplicateAlert, setDuplicateAlert] = useState(""); // For duplicate project title

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProposals();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

  const fetchProposals = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getProposals(token);
      setProposals(data);
    } catch (err) {
      setError("Failed to load proposals");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // Check for duplicate project title for different supervisors
    if (name === "title" || name === "supervisor") {
      const titleToCheck = name === "title" ? value : form.title;
      const supervisorToCheck = name === "supervisor" ? value : form.supervisor;

      if (titleToCheck && supervisorToCheck) {
        const duplicate = proposals.find(
          (p) =>
            p.title.trim().toLowerCase() ===
              titleToCheck.trim().toLowerCase() &&
            String(p.supervisor) !== String(supervisorToCheck)
        );
        if (duplicate) {
          setDuplicateAlert(
            "This project title is already submitted for another supervisor. Please choose a unique title."
          );
        } else {
          setDuplicateAlert("");
        }
      } else {
        setDuplicateAlert("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    if (duplicateAlert) {
      setSubmitting(false);
      setError(duplicateAlert);
      return;
    }
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await submitProposal(form, token);
      setSuccess("Proposal submitted successfully!");
      setForm({
        title: "",
        description: "",
        document: null,
        supervisor: "",
        batch: "",
      });
      fetchProposals();
    } catch (err) {
      setError("Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "student")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Submit New Project Proposal</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Select Supervisor</label>
          <select
            name="supervisor"
            value={form.supervisor}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">-- Choose Supervisor --</option>
            {supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Batch</label>
          <input
            type="text"
            name="batch"
            value={form.batch}
            onChange={handleChange}
            required
            placeholder="e.g. Batch-24"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Proposal Document</label>
          <input
            type="file"
            name="document"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
            className="mt-1 block w-full"
          />
        </div>
        {duplicateAlert && (
          <p className="text-red-600 text-sm">{duplicateAlert}</p>
        )}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-2">My Proposals</h3>
      <div className="bg-white rounded shadow p-4">
        {proposals.length === 0 ? (
          <p>No proposals submitted yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th>Supervisor</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>
                    {supervisors.find(
                      (sup) => String(sup.id) === String(p.supervisor)
                    )?.name || "-"}
                  </td>
                  <td>{p.batch}</td>
                  <td>{p.status}</td>
                  <td>{p.feedback || "-"}</td>
                  <td>{new Date(p.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentProposals;
