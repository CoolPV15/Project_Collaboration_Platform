/**
 * @file LeadProjects.jsx
 * @description
 * React component that displays all projects created by the authenticated user (Team Lead).
 * 
 * Features:
 * - Fetches all projects owned by the logged-in user.
 * - Expands/collapses project cards to show join requests and current members.
 * - Allows the Team Lead to Accept/Reject join requests.
 * - Displays project members with their basic details.
 *
 * @author Pranav Singh
 */

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider.jsx";

import {
  Users,
  ChevronRight,
  ChevronDown,
  Loader2,
  Mail,
  User,
  UserCheck,
  UserX,
} from "lucide-react";

/**
 * @component LeadProjects
 * @description
 * Main functional component that renders all projects created by the authenticated user.
 * Handles:
 * - Fetching lead-created projects
 * - Fetching join requests for each project
 * - Fetching members for each project
 * - Accept/Reject actions
 * - UI expand/collapse of project cards
 *
 * @returns {JSX.Element} Rendered project list with interactions.
 */
function LeadProjects() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [leadProjects, setLeadProjects] = useState([]);

  const [expandedProject, setExpandedProject] = useState(null);

  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);

  const [requestLoading, setRequestLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  /**
   * @function useEffect
   * @description
   * Fetches all projects created by the authenticated user using their email ID.
   * Runs whenever `user` is available.
   */
  useEffect(() => {
    if (!user) return;

    /**
     * @async
     * @function fetchLeadProjects
     * @description Calls backend API to retrieve all projects created by the team lead.
     * @returns {Promise<void>}
     */
    const fetchLeadProjects = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://127.0.0.1:8000/api/projectleads/", {
          params: { email: user.email },
        });

        setLeadProjects(res.data || []);
      } catch (err) {
        console.error("Error fetching lead projects:", err);
        setLeadProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadProjects();
  }, [user]);

  /**
   * @async
   * @function fetchRequests
   * @param {string} projectname - The project for which join requests must be fetched.
   * @description
   * Retrieves all pending join requests for the given project.
   */
  const fetchRequests = async (projectname) => {
    setRequestLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projectrequestsdisplay/",
        {
          params: {
            email: user.email,
            projectname,
          },
        }
      );

      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests", err);
      setRequests([]);
    } finally {
      setRequestLoading(false);
    }
  };

  /**
   * @async
   * @function fetchMembers
   * @param {string} projectname - Name of the project.
   * @description Retrieves all currently approved team members for the project.
   */
  const fetchMembers = async (projectname) => {
    setMembersLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projectmembersdisplay/",
        {
          params: {
            email: user.email,
            projectname,
          },
        }
      );

      setMembers(res.data || []);
    } catch (err) {
      console.error("Error fetching members", err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  /**
   * @function handleToggle
   * @param {string} projectname - Name of the project clicked by the user.
   * @description
   * Expands/collapses a project card and loads requests and members when expanded.
   */
  const handleToggle = (projectname) => {
    if (expandedProject === projectname) {
      setExpandedProject(null);
      setRequests([]);
      setMembers([]);
    } else {
      setExpandedProject(projectname);
      fetchRequests(projectname);
      fetchMembers(projectname);
    }
  };

  /**
   * @async
   * @function handleAccept
   * @param {string} email - Email of requester
   * @param {string} projectname - Name of the project
   * @param {number} id - Project ID for deletion
   * @description
   * Approves a join request by:
   * - Adding member to projectmembers table
   * - Deleting the pending request from backend
   */
  const handleAccept = async (email, projectname, id) => {
    setRequestLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/projectmembers/", {
        owner: user.email,
        email,
        projectname,
      });

      await axios.delete(`http://127.0.0.1:8000/api/projectrequests/${id}/`);

      fetchRequests(projectname);
      fetchMembers(projectname);
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  /**
   * @async
   * @function handleReject
   * @param {string} email - Email of requester
   * @param {string} projectname - Name of the project
   * @param {number} id - Project ID for deletion
   * @description
   * Rejects a join request by:
   * - Adding requester to rejected list
   * - Deleting their pending request
   */
  const handleReject = async (email, projectname, id) => {
    setRequestLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/projectreject/", {
        owner: user.email,
        email,
        projectname,
      });

      await axios.delete(`http://127.0.0.1:8000/api/projectrequests/${id}/`);

      fetchRequests(projectname);
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading your created projects...
      </div>
    );
  }

  if (leadProjects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-gray-500 py-10">
        <Users size={48} className="mb-2 text-gray-400" />
        <p>You have not created any teams yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {leadProjects.map((p) => {
        const projectname = p.projectname;

        return (
          <div
            key={projectname}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >
            {/* ----------------------------  PROJECT HEADER  ---------------------------- */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleToggle(projectname)}
            >
              <div>
                <h3 className="text-lg font-semibold text-indigo-600">
                  {projectname}
                </h3>
                <p className="text-sm text-gray-600">{p.description}</p>
              </div>

              {expandedProject === projectname ? (
                <ChevronDown size={22} className="text-gray-500" />
              ) : (
                <ChevronRight size={22} className="text-gray-500" />
              )}
            </div>

            {/* ---------------------------- EXPANDED PROJECT DETAILS ---------------------------- */}
            {expandedProject === projectname && (
              <div className="mt-6 border-t pt-6 space-y-8">

                {/*---------------------------- PENDING REQUESTS ----------------------------*/}
                <div>
                  <h4 className="text-md font-semibold text-indigo-700 mb-3">
                    Pending Join Requests
                  </h4>

                  {requestLoading ? (
                    <div className="flex justify-center py-4 text-gray-500">
                      <Loader2 className="animate-spin mr-2" /> Loading...
                    </div>
                  ) : requests.length === 0 ? (
                    <p className="text-gray-500 italic">No requests yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((req, idx) => (
                        <div
                          key={req.email + idx}
                          className="p-5 border rounded-xl shadow-sm bg-gradient-to-r from-indigo-50 to-white"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-800 font-medium">
                                <User size={16} className="inline mr-1" />
                                {req.fname} {req.lname}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Mail size={14} className="mr-1" />
                                {req.email}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleAccept(req.email, projectname, req.id)
                                }
                                className="px-4 py-1.5 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
                              >
                                <UserCheck size={14} /> Accept
                              </button>

                              <button
                                onClick={() =>
                                  handleReject(req.email, projectname, req.id)
                                }
                                className="px-4 py-1.5 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600"
                              >
                                <UserX size={14} /> Reject
                              </button>
                            </div>
                          </div>

                          {req.message && (
                            <p className="mt-3 bg-gray-50 border-l-4 border-indigo-400 p-3 text-sm text-gray-700 italic">
                              "{req.message}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/*---------------------------- CURRENT MEMBERS ----------------------------*/}
                <div>
                  <h4 className="text-md font-semibold text-indigo-700 mb-3">
                    Current Team Members
                  </h4>

                  {membersLoading ? (
                    <div className="flex justify-center py-3 text-gray-500">
                      <Loader2 className="animate-spin mr-2" /> Loading...
                    </div>
                  ) : members.length === 0 ? (
                    <p className="text-gray-500 italic">No members added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {members.map((m, idx) => (
                        <div
                          key={m.member_email + idx}
                          className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            {m.member_fname?.[0]?.toUpperCase() || "X"}
                          </div>

                          <div>
                            <p className="font-medium text-gray-800">
                              {m.member_fname} {m.member_lname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {m.member_email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default LeadProjects;