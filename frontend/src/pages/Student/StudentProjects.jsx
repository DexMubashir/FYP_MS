import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getProjects } from "../../services/proposals";

const StudentProjects = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
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

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "student")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="bg-white rounded shadow p-4">
        {projects.length === 0 ? (
          <p>No projects assigned to you yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Supervisor</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.supervisor}</td>
                  <td>{p.status}</td>
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

export default StudentProjects;
