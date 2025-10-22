import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider.jsx";

/* Author: Pranav Singh */
/* Component to display the available teams */

function JoinTeam() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null); // For modal

  useEffect(() => {
    if (!user) return; // Wait until user is available

    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/projects/", {
          params: { email: user.email, frontend: user.frontend, backend: user.backend },
        });

        setProjects(response.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading projects...</p>;
  }

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Join a Team
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center">
          No teams available to join currently. Check back later!
        </p>
      ) : (
        
        <div className="rounded-xl shadow-xl grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((team) => (
            <div
              key={team.id || team.projectname}
              className="bg-white border rounded-lg shadow hover:shadow-lg p-5 flex flex-col justify-between transition-transform transform hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-bold text-indigo-600 truncate">
                  {team.projectname}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {team.description}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Owner: {team.fname} {team.lname}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {team.frontend && (
                    <span className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                      Frontend
                    </span>
                  )}
                  {team.backend && (
                    <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                      Backend
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(team)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL / POPUP */}
      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedProject(null); // Close when clicking outside
          }}
        >
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-xl shadow-xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-3">
              {selectedProject.projectname}
            </h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
              {selectedProject.description}
            </p>
            <p className="text-gray-500 text-sm mt-2 mb-4 whitespace-pre-line leading-relaxed">
              Owner: {selectedProject.fname} {selectedProject.lname}
            </p>
            <p className="text-gray-500 text-sm mt-2 mb-4 whitespace-pre-line leading-relaxed">
              Email: {selectedProject.owner_email}
            </p>


            <div className="flex flex-wrap gap-3 mb-5">
              {selectedProject.frontend && (
                <span className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                  Frontend
                </span>
              )}
              {selectedProject.backend && (
                <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  Backend
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Join Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinTeam;
