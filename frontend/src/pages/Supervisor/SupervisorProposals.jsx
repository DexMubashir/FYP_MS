import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getProposals, updateProposal } from "../../services/proposals";

const SupervisorProposals = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState({});

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

  const handleAction = async (id, status) => {
    setUpdatingId(id);
    setError("");
    setSuccess("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await updateProposal(id, { status, feedback: feedback[id] || "" }, token);
      setSuccess(`Proposal ${status}`);
      fetchProposals();
    } catch (err) {
      setError("Failed to update proposal");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "supervisor")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Project Proposals</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="bg-white rounded shadow p-4">
        {proposals.length === 0 ? (
          <p>No proposals assigned to you yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th>Student</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.student}</td>
                  <td>{p.status}</td>
                  <td>
                    <textarea
                      value={feedback[p.id] ?? p.feedback ?? ""}
                      onChange={(e) =>
                        setFeedback((f) => ({ ...f, [p.id]: e.target.value }))
                      }
                      className="border rounded p-1 w-32"
                    />
                  </td>
                  <td>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded mr-1"
                      disabled={updatingId === p.id}
                      onClick={() => handleAction(p.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      disabled={updatingId === p.id}
                      onClick={() => handleAction(p.id, "rejected")}
                    >
                      Reject
                    </button>
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

export default SupervisorProposals;
