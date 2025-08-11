import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getRubrics,
  getEvaluations,
  submitEvaluation,
} from "../../services/evaluations";
import { getProjects } from "../../services/proposals";

const SupervisorEvaluations = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRubric, setSelectedRubric] = useState("");
  const [scores, setScores] = useState([]);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects();
      fetchRubrics();
      fetchEvaluations();
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

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setSelectedRubric("");
    setScores([]);
    setComments("");
  };

  const handleRubricChange = (e) => {
    const rubricId = e.target.value;
    setSelectedRubric(rubricId);
    const rubric = rubrics.find((r) => r.id === parseInt(rubricId));
    if (rubric) {
      setScores(
        rubric.criteria.map((c) => ({ name: c.name, score: 0, max: c.max }))
      );
    } else {
      setScores([]);
    }
  };

  const handleScoreChange = (idx, value) => {
    setScores((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, score: Number(value) } : s))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const rubric = rubrics.find((r) => r.id === parseInt(selectedRubric));
      const total = scores.reduce((sum, s) => sum + s.score, 0);
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await submitEvaluation(
        {
          project: selectedProject,
          rubric: selectedRubric,
          scores,
          total_score: total,
          comments,
        },
        token
      );
      setSuccess("Evaluation submitted!");
      setSelectedProject("");
      setSelectedRubric("");
      setScores([]);
      setComments("");
      fetchEvaluations();
    } catch (err) {
      setError("Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  const projectEvaluations = (projectId) =>
    evaluations.filter((ev) => ev.project === parseInt(projectId));

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "supervisor")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Project Evaluations</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">Submit Evaluation</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Project</label>
            <select
              name="project"
              value={selectedProject}
              onChange={handleProjectChange}
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
            <label className="block text-sm font-medium">Rubric</label>
            <select
              name="rubric"
              value={selectedRubric}
              onChange={handleRubricChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select rubric</option>
              {rubrics.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {scores.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Scores</label>
              {scores.map((c, idx) => (
                <div key={c.name} className="flex items-center mb-2">
                  <span className="w-40">
                    {c.name} (max {c.max})
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={c.max}
                    value={c.score}
                    onChange={(e) => handleScoreChange(idx, e.target.value)}
                    className="ml-2 w-20 border border-gray-300 rounded p-1"
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium">Comments</label>
            <textarea
              name="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Evaluation History</h3>
        {projects.map((p) => (
          <div key={p.id} className="mb-4">
            <h4 className="font-medium">{p.title}</h4>
            <ul className="ml-4 list-disc">
              {projectEvaluations(p.id).length === 0 ? (
                <li className="text-gray-500 text-sm">No evaluations yet.</li>
              ) : (
                projectEvaluations(p.id).map((ev) => (
                  <li key={ev.id} className="text-sm">
                    <span className="font-semibold">{ev.evaluator_email}</span>:{" "}
                    {ev.total_score} /{" "}
                    {rubrics.find((r) => r.id === ev.rubric)?.max_score || "?"}{" "}
                    ({new Date(ev.created_at).toLocaleString()})
                    {ev.comments && (
                      <span className="ml-2 text-gray-500">{ev.comments}</span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorEvaluations;
