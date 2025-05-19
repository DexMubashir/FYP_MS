import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUser,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const GroupList = () => {
  const [groups, setGroups] = useState([]);

  // Mock group data - in real app, fetch from backend
  useEffect(() => {
    const mockGroups = [
      {
        id: 1,
        name: "AI Innovators",
        description: "Exploring AI applications in education",
        members: [
          { id: 1, name: "Ali Khan", email: "ali.khan@university.edu" },
          { id: 2, name: "Sara Ahmed", email: "sara.ahmed@university.edu" },
        ],
      },
      {
        id: 2,
        name: "Tech Pioneers",
        description: "Blockchain solutions for secure exams",
        members: [
          { id: 3, name: "Ahmed Raza", email: "ahmed.raza@university.edu" },
          { id: 4, name: "Fatima Zahra", email: "fatima.zahra@university.edu" },
          { id: 5, name: "Zainab Malik", email: "zainab.malik@university.edu" },
        ],
      },
    ];

    setGroups(mockGroups);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            Existing FYP Groups
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            View all currently formed Final Year Project groups
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-md">
            <p className="text-gray-500 text-sm">No groups available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-blue-500 mr-2"
                    />
                    {group.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {group.members.length} member
                    {group.members.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {group.description || "No description provided."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex-shrink-0 text-blue-500">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="h-5 w-5 mr-2"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
