import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getDocuments, uploadDocument } from "../../services/proposals";

const StudentDocuments = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({
    project: "",
    file: null,
    name: "",
    type: "other",
    version: 1,
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDocuments();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

  const fetchDocuments = async () => {
    try {
      setError("");
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      const data = await getDocuments(token);
      setDocuments(data);
    } catch (err) {
      setError("Failed to load documents");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const token =
        localStorage.getItem("access") || sessionStorage.getItem("access");
      await uploadDocument(form, token);
      setSuccess("Document uploaded successfully!");
      setForm({
        project: "",
        file: null,
        name: "",
        type: "other",
        version: 1,
        description: "",
      });
      fetchDocuments();
    } catch (err) {
      setError("Failed to upload document");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "student")
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Project Documents</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">Upload New Document</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Project ID</label>
            <input
              type="text"
              name="project"
              value={form.project}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Document Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded p-2"
            >
              <option value="report">Report</option>
              <option value="code">Code</option>
              <option value="presentation">Presentation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Version</label>
            <input
              type="number"
              name="version"
              value={form.version}
              onChange={handleChange}
              min={1}
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
            <label className="block text-sm font-medium">File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              required
              className="block w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Version</th>
                <th>Uploaded By</th>
                <th>Uploaded At</th>
                <th>File</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.version}</td>
                  <td>{d.uploaded_by_email}</td>
                  <td>{new Date(d.uploaded_at).toLocaleString()}</td>
                  <td>
                    <a href={d.file} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </td>
                  <td>{d.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentDocuments;
