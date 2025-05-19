import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faCheckCircle,
  faExclamationCircle,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

const UploadSubmission = () => {
  const [submissionType, setSubmissionType] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!submissionType) {
      setError("Please select a submission type.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!file) {
      setError("Please upload a file.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // In a real app, you'd POST to backend with FormData
    console.log("Uploaded submission:", {
      type: submissionType,
      file: file.name,
      notes,
    });

    setSuccess("Submission uploaded successfully!");
    setTimeout(() => setSuccess(""), 3000);

    // Reset form
    setSubmissionType("");
    setFile(null);
    setNotes("");
    document.getElementById("fileInput").value = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Upload FYP Submission
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Submit your project files like proposals, reports, and
            presentations.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="h-5 w-5 text-green-500 mr-2"
              />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="h-5 w-5 text-red-500 mr-2"
              />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Submission Type */}
            <div className="mb-4">
              <label
                htmlFor="submissionType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Submission Type *
              </label>
              <select
                id="submissionType"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">-- Select Type --</option>
                <option value="Proposal">Proposal</option>
                <option value="Report">Progress Report</option>
                <option value="Poster">Poster</option>
                <option value="Presentation">Presentation Slides</option>
                <option value="Final Thesis">Final Thesis</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label
                htmlFor="fileInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload File *
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Notes (Optional) */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional details..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadSubmission;
