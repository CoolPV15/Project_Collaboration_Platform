/**
 * @file JoinTeam.jsx
 * @description
 * This component allows authenticated users to browse available teams/projects and send
 * join requests to team owners. It displays a grid of teams fetched from the backend
 * based on the user's skill set (frontend/backend). Upon selecting a project, a modal
 * appears allowing the user to compose and send a personalized message to the project owner.
 *
 * It features:
 * - Dynamic fetching of team data using Axios
 * - Real-time validation of message input
 * - Context-aware user data via AuthContext
 * - Modal-based UI for submitting join requests
 * - Error handling via a custom ErrorToast component
 *
 * @module JoinTeam
 * @author Pranav Singh
 */

import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider.jsx";
import ErrorToast from "../toasts/ErrorToast.jsx";
import { Users, Code2, UserCircle } from "lucide-react";

/* -------------------------------------------------------------------------------------------------
 * Component: JoinTeam
 * -------------------------------------------------------------------------------------------------*/

/**
 * @function JoinTeam
 * @description
 * Main functional component for displaying available teams and handling team join requests.
 *
 * @returns {JSX.Element} Rendered JoinTeam component.
 */
function JoinTeam() {
  /** --------------------------- State Management --------------------------- */
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

    /** ------------------------------------------------------------------------
   * @function useEffect
   * @description Fetches available projects from the API based on the user’s skills (frontend/backend).
   * Triggered whenever the `user` object changes.
   * ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!user) return;

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

  /** ------------------------------------------------------------------------
   * @function handleMessageChange
   * @description
   * Handles message input changes, limits characters to 250, and updates the character counter.
   *
   * @param {Event} e - The input change event.
   *------------------------------------------------------------------------ */
  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length > 250) return;
    setCount(value.length);
    setMessage(value);
  };

  /** ------------------------------------------------------------------------
   * @function authenticateData
   * @description
   * Validates message and project selection, constructs the join request payload,
   * and sends it to the backend API.
   *
   * @async
   * @returns {Promise<void>}
   * ------------------------------------------------------------------------ */
  const authenticateData = async () => {
    const final_message = message.trim();
    if (final_message.length < 10) {
      setError("Message is too short");
      return;
    }

    if (!selectedProject?.owner_email || !selectedProject?.projectname) {
      setError("No Project Selected");
      return;
    }

    const new_request = {
      owner_email: selectedProject.owner_email,
      projectname: selectedProject.projectname,
      member_email: user.email,
      message: final_message,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/projectrequests/", new_request);
      console.log("Request Sent");
    } catch (err) {
      console.log("An Error occurred ", err);
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description
   * Prevents default form submission behavior and triggers data authentication and submission.
   *
   * @param {Event} e - Form submission event.
   * ------------------------------------------------------------------------*/
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateData();
  };

  /** ------------------------------------------------------------------------
   * @function handleErrorClose
   * @description Closes the error toast notification.
   * ------------------------------------------------------------------------ */
  const handleErrorClose = () => setError("");

  /* -------------------------------------------------------------------------------------------------
   * Conditional Rendering: Loading State
   * -------------------------------------------------------------------------------------------------*/
  if (loading) {
    return <p className="text-center text-gray-500">Loading projects...</p>;
  }

  /* -------------------------------------------------------------------------------------------------
   * JSX: Render Component UI
   * -------------------------------------------------------------------------------------------------*/
  return (
    <div className="p-8 relative">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <Users className="text-indigo-600" size={28} />
        Join a Team
      </h2>

      {/* Display projects or empty state */}
      {projects.length === 0 ? (
        <p className="text-gray-500 text-center">
          No teams available to join currently. Check back later!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((team) => (
            <div
              key={team.id || team.projectname}
              className="relative group flex flex-col justify-between h-full bg-gradient-to-br from-white/80 to-blue-50/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-indigo-700 truncate">
                    {team.projectname}
                  </h3>
                  <Code2 className="text-indigo-500" size={22} />
                </div>

                <p className="text-gray-600 mb-3 line-clamp-3 min-h-[60px]">
                  {team.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <UserCircle className="w-4 h-4 mr-1 text-gray-400" />
                  {team.fname} {team.lname}
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {team.frontend && (
                    <span className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
                      Frontend
                    </span>
                  )}
                  {team.backend && (
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                      Backend
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(team)}
                className="w-full mt-auto py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-medium shadow hover:shadow-md hover:from-indigo-700 hover:to-blue-600 transition-transform transform active:scale-95"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMessage("");
              setCount(0);
              setSelectedProject(null);
            }
          }}
        >
          <div className="bg-white/90 backdrop-blur-md w-11/12 md:w-2/3 lg:w-1/2 rounded-3xl shadow-2xl p-8 relative animate-fadeIn border border-gray-200">
            <button
              onClick={() => {
                setMessage("");
                setCount(0);
                setSelectedProject(null);
              }}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              {selectedProject.projectname}
            </h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
              {selectedProject.description}
            </p>
            <p className="text-gray-500 text-sm">
              Owner: {selectedProject.fname} {selectedProject.lname}
            </p>
            <p className="text-gray-500 text-sm mb-5">
              Email: {selectedProject.owner_email}
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              {selectedProject.frontend && (
                <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                  Frontend
                </span>
              )}
              {selectedProject.backend && (
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  Backend
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <img
                className="w-10 h-10 rounded-full border border-gray-300"
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="User Avatar"
              />

              <div className="flex-1 border border-gray-300 rounded-xl focus-within:border-indigo-500 transition bg-white/80 backdrop-blur-sm">
                <textarea
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Add your message..."
                  className="w-full h-28 resize-none p-3 outline-none rounded-t-xl text-sm bg-transparent"
                ></textarea>

                <div className="flex justify-between items-center px-3 pb-3">
                  <span className="text-xs text-gray-500">
                    {count}/250 characters
                  </span>
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-medium px-5 py-2 rounded-xl shadow"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-5 ml-12">
                <ErrorToast error={error} onClose={handleErrorClose} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinTeam;