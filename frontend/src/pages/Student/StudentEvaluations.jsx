import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getEvaluations, getRubrics } from "../../services/evaluations";
import { getProjects } from "../../services/proposals";

const StudentEvaluations = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
      fetchEvaluations();
      fetchRubrics();
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

  const fetchEvaluations = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getEvaluations(token);
      setEvaluations(data);
    } catch (err) {
      setError("Failed to load evaluations");
    }
  };

  const fetchRubrics = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getRubrics(token);
      setRubrics(data);
    } catch (err) {
      setError("Failed to load rubrics");
    }
  };

  const projectEvaluations = (projectId) =>
    evaluations.filter((ev) => ev.project === parseInt(projectId));

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "student")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">My Project Evaluations</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="bg-white rounded shadow p-4">
        {projects.map((p) => (
          <div key={p.id} className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
            <ul className="ml-4 list-disc">
              {projectEvaluations(p.id).length === 0 ? (
                <li className="text-gray-500 text-sm">No evaluations yet.</li>
              ) : (
                projectEvaluations(p.id).map((ev) => {
                  const rubric = rubrics.find((r) => r.id === ev.rubric);
                  return (
                    <li key={ev.id} className="mb-2 text-sm">
                      <div className="mb-1">
                        <span className="font-semibold">Evaluator:</span>{" "}
                        {ev.evaluator_email} |{" "}
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(ev.created_at).toLocaleString()}
                      </div>
                      <div className="mb-1">
                        <span className="font-semibold">Total Score:</span>{" "}
                        {ev.total_score} / {rubric?.max_score || "?"}
                      </div>
                      {rubric && (
                        <div className="mb-1">
                          <span className="font-semibold">Criteria:</span>
                          <ul className="ml-4 list-disc">
                            {rubric.criteria.map((c, idx) => {
                              const scoreObj = ev.scores.find(
                                (s) => s.name === c.name
                              );
                              return (
                                <li key={c.name}>
                                  {c.name}: {scoreObj ? scoreObj.score : "-"} /{" "}
                                  {c.max}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      {ev.comments && (
                        <div className="mb-1">
                          <span className="font-semibold">Comments:</span>{" "}
                          {ev.comments}
                        </div>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEvaluations;
