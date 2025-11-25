/**
 * @file LeadProjects.jsx
 * @description 
 * Displays all projects created by the authenticated user (team lead).
 * On expanding a project, it fetches:
 *  - pending join requests (projectrequestsdisplay)
 *  - team members (projectmembersdisplay)
 * Lead can Accept/Reject join requests.
 * 
 * Fully aligned with backend structure:
 *  - projectmembersdisplay → [{ member_email, member_fname, member_lname }]
 *  - projectrequestsdisplay → [{ email, fname, lname, message, id }]
 * 
 * @author
 * Pranav Singh
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

function LeadProjects() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [leadProjects, setLeadProjects] = useState([]);

  const [expandedProject, setExpandedProject] = useState(null);

  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);

  const [requestLoading, setRequestLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  // -------------------------------
  // Fetch all projects created by user
  // -------------------------------
  useEffect(() => {
    if (!user) return;

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

  // -------------------------------
  // Fetch join requests
  // -------------------------------
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

  // -------------------------------
  // Fetch current team members
  // -------------------------------
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

  // -------------------------------
  // Expand/collapse project card
  // -------------------------------
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

  // -------------------------------
  // Accept Request
  // -------------------------------
  const handleAccept = async (email, projectname, id) => {
    setRequestLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/projectmembers/", {
        owner: user.email,
        email,
        projectname,
      });

      // delete request from backend
      await axios.delete(`http://127.0.0.1:8000/api/projectrequests/${id}/`);

      fetchRequests(projectname);
      fetchMembers(projectname);
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  // -------------------------------
  // Reject Request
  // -------------------------------
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

  // ----------------------------------------------
  // LOADING STATE
  // ----------------------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading your created projects...
      </div>
    );
  }

  // ----------------------------------------------
  // NO PROJECTS
  // ----------------------------------------------
  if (leadProjects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-gray-500 py-10">
        <Users size={48} className="mb-2 text-gray-400" />
        <p>You have not created any teams yet.</p>
      </div>
    );
  }

  // ----------------------------------------------
  // MAIN RENDER
  // ----------------------------------------------
  return (
    <div className="space-y-6">
      {leadProjects.map((p) => {
        const projectname = p.projectname;

        return (
          <div
            key={projectname}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
          >
            {/* Header */}
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

            {/* Expanded content */}
            {expandedProject === projectname && (
              <div className="mt-6 border-t pt-6 space-y-8">
                {/* Requests */}
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

                {/* Team Members */}
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
                            <p className="text-sm text-gray-500">{m.member_email}</p>
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