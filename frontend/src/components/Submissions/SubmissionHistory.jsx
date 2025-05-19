import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);

  // Mock data - Replace with real API fetch
  useEffect(() => {
    const mockSubmissions = [
      {
        id: 1,
        title: "Proposal Document",
        type: "Proposal",
        date: "2024-02-12",
        status: "Reviewed",
        fileUrl: "/files/proposal.pdf",
      },
      {
        id: 2,
        title: "Progress Report 1",
        type: "Report",
        date: "2024-03-10",
        status: "Pending",
        fileUrl: "/files/progress1.pdf",
      },
      {
        id: 3,
        title: "Poster Draft",
        type: "Poster",
        date: "2024-04-05",
        status: "Rejected",
        fileUrl: "/files/poster.pdf",
      },
    ];
    setSubmissions(mockSubmissions);
  }, []);

  const statusIcon = (status) => {
    switch (status) {
      case "Reviewed":
        return (
          <span className="text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            Reviewed
          </span>
        );
      case "Pending":
        return (
          <span className="text-yellow-500">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="text-red-500">
            <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Submission History
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all your FYP deliverables
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-md">
            <p className="text-gray-500 text-sm">No submissions found.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {submission.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {statusIcon(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a
                        href={submission.fileUrl}
                        download
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-1" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;
