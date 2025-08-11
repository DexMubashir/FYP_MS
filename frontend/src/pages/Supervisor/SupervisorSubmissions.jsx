import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  getSubmissions,
  getFeedbackThread,
  postFeedbackMessage,
} from "../../services/submissions";

const SupervisorSubmissions = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubmissions();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

  const fetchSubmissions = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getSubmissions(token);
      setSubmissions(data);
    } catch (err) {
      setError("Failed to load submissions");
    }
  };

  const openFeedback = async (threadId) => {
    setSelectedThread(threadId);
    setFeedback([]);
    setError("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const thread = await getFeedbackThread(threadId, token);
      setFeedback(thread.messages);
    } catch (err) {
      setError("Failed to load feedback");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setError("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await postFeedbackMessage(
        { thread: selectedThread, message: newMessage },
        token
      );
      setNewMessage("");
      openFeedback(selectedThread);
    } catch (err) {
      setError("Failed to send message");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "supervisor")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Project Submissions</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Submissions</h3>
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Student</th>
                <th>Project</th>
                <th>File</th>
                <th>Submitted</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.student}</td>
                  <td>{s.project}</td>
                  <td>
                    <a href={s.file} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </td>
                  <td>{new Date(s.submitted_at).toLocaleString()}</td>
                  <td>
                    {s.feedback_thread ? (
                      <button
                        className="text-blue-600 underline"
                        onClick={() => openFeedback(s.feedback_thread.id)}
                      >
                        View
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedThread(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Feedback Thread</h3>
            <div className="max-h-64 overflow-y-auto mb-4">
              {feedback.length === 0 ? (
                <p className="text-gray-500">No messages yet.</p>
              ) : (
                feedback.map((msg) => (
                  <div key={msg.id} className="mb-2">
                    <span className="font-semibold">{msg.sender_email}:</span>{" "}
                    {msg.message}
                    <div className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorSubmissions;
