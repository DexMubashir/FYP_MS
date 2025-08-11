import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getMilestones } from "../../services/proposals";

const StudentMilestones = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMilestones();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

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

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "student")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Project Milestones</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="bg-white rounded shadow p-4">
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
              </tr>
            </thead>
            <tbody>
              {milestones.map((m) => (
                <tr key={m.id}>
                  <td>{m.project}</td>
                  <td>{m.title}</td>
                  <td>{m.status}</td>
                  <td>{m.due_date}</td>
                  <td>{m.completion_date || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentMilestones;
