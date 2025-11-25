/**
 * @file PendingProjects.jsx
 * @description
 * Displays all projects for which the current user has sent a join request
 * and is waiting for approval. Pulls data from: /api/pendingprojects/
 *
 * This page only displays the list of pending requests.
 */

import { Clock, Mail, User } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { useContext, useEffect, useState } from "react";

function PendingProjects() {
  const { user } = useContext(AuthContext);

  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPendingProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/pendingprojects/",
          {
            params: { email: user.email },
          }
        );

        setPendingProjects(response.data || []);
      } catch (err) {
        console.log("Error fetching pending projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, [user]);

  // ----------------------------
  // Loading state
  // ----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="animate-spin mr-2" /> Loading pending requests...
      </div>
    );
  }

  // ----------------------------
  // Empty state
  // ----------------------------
  if (pendingProjects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Clock size={40} className="mx-auto mb-3 text-gray-400" />
        <p>No pending requests currently</p>
      </div>
    );
  }

  // ----------------------------
  // Main render
  // ----------------------------
  return (
    <div className="space-y-6">
      {pendingProjects.map((p, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
        >
          {/* Header */}
          <h3 className="text-lg font-semibold text-indigo-600">
            {p.projectname}
          </h3>

          <p className="text-sm text-gray-700 mt-1">{p.description}</p>

          {/* Owner details */}
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p className="flex items-center">
              <User size={16} className="mr-1 text-gray-500" />
              Owner: {p.owner_fname} {p.owner_lname}
            </p>

            <p className="flex items-center">
              <Mail size={16} className="mr-1 text-gray-500" />
              {p.owner_email}
            </p>
          </div>

          {/* User Message */}
          <div className="mt-5 bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-md">
            <h4 className="font-medium text-gray-800">Your Request Message:</h4>
            <p className="text-sm text-gray-600 mt-1 italic">"{p.message}"</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingProjects;