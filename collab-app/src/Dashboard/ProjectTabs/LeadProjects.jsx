/**
 * @file LeadProjects.jsx
 * @description
 * React component that displays all projects created by the authenticated user (Team Lead).
 * 
 * @features
 * - Fetches all projects owned by the logged-in user.
 * - Expands/collapses project cards to show join requests and current members.
 * - Allows the Team Lead to Accept/Reject join requests.
 * - Displays project members with their basic details.
 *
 * @author Pranav Singh
 */

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import axiosInstance from "../../Interceptors/axiosInstance";
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
  MessageCircle,
  Check,
  X,
} from "lucide-react";

/**
 * @component LeadProjects
 * @description
 * Main functional component that renders all projects created by the authenticated user.
 * Handles:
 * - Fetching lead-created projects
 * - Fetching join requests for each project
 * - Fetching members for each project
 * - Accept/Reject actions with confirmation modal
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
  const [expandedRequest, setExpandedRequest] = useState({});
  const [confirm, setConfirm] = useState(null);

  /**
   * @function useEffect
   * @description Fetches all projects created by the logged-in user.
   */
  useEffect(() => {
    if (!user) return;
    const fetchLeadProjects = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("api/projectleads/", {
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
   * @function fetchRequests
   * @description
   * Fetches all pending join requests for a specific project owned by the logged-in lead.
   *
   * @param {string} projectname - Name of the project whose requests must be fetched.
   * @returns {Promise<void>} Updates the `requests` state with retrieved request data.
   */
  const fetchRequests = async (projectname) => {
    setRequestLoading(true);
    try {
      const res = await axiosInstance.get("api/projectrequestsdisplay/", {
        params: { email: user.email, projectname },
      });
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests", err);
      setRequests([]);
    } finally {
      setRequestLoading(false);
    }
  };

  /**
   * @function fetchMembers
   * @description
   * Retrieves a list of all currently accepted team members for a given project.
   *
   * @param {string} projectname - The project for which member details should be fetched.
   * @returns {Promise<void>} Updates the `members` state with fetched team member data.
   */
  const fetchMembers = async (projectname) => {
    setMembersLoading(true);
    try {
      const res = await axiosInstance.get("api/projectmembersdisplay/", {
        params: { email: user.email, projectname },
      });
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
   * @description
   * Toggles the expansion state of a selected project card. When expanded, it triggers
   * loading of join requests and current team members for that project.
   *
   * @param {string} projectname - The name of the project being expanded or collapsed.
   * @returns {void}
   */
  const handleToggle = (projectname) => {
    if (expandedProject === projectname) {
      setExpandedProject(null);
      setRequests([]);
      setMembers([]);
      setExpandedRequest({});
    } else {
      setExpandedProject(projectname);
      fetchRequests(projectname);
      fetchMembers(projectname);
    }
  };

  /**
   * @function handleRejectConfirmed
   * @description
   * Executes the final Reject action for a join request after confirmation.
   * Logs the rejection and removes the pending request.
   *
   * @returns {Promise<void>} Performs API operations for rejection logging and request deletion.
   */
  const handleAcceptConfirmed = async () => {
    if (!confirm) return;
    const { email, projectname, id, message } = confirm;
    setRequestLoading(true);
    try {
      await axiosInstance.post("api/projectmembers/", {
        owner: user.email,
        email,
        projectname,
        message,
      });

      await axiosInstance.delete(`api/projectrequests/${id}/`);
      await fetchRequests(projectname);
      await fetchMembers(projectname);
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setRequestLoading(false);
      setConfirm(null);
    }
  };

  /**
   * @function handleRejectConfirmed
   * @description
   * Executes the final Reject action for a join request after confirmation.
   * Logs the rejection and removes the pending request.
   *
   * @returns {Promise<void>} Performs API operations for rejection logging and request deletion.
   */
  const handleRejectConfirmed = async () => {
    if (!confirm) return;
    const { email, projectname, id, message } = confirm;
    setRequestLoading(true);
    try {
      await axiosInstance.post("api/projectreject/", {
        owner: user.email,
        email,
        projectname,
        message,
      });

      await axiosInstance.delete(`api/projectrequests/${id}/`);
      await fetchRequests(projectname);
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setRequestLoading(false);
      setConfirm(null);
    }
  };

  /**
   * @function openConfirm
   * @description
   * Opens the confirmation modal and stores action type (accept/reject) along with
   * relevant request and project details.
   *
   * @param {"accept"|"reject"} action - Type of action being confirmed.
   * @param {Object} req - Request object containing applicant data.
   * @param {string} req.email - Email of the applicant.
   * @param {string} req.fname - Applicant's first name.
   * @param {string} req.lname - Applicant's last name.
   * @param {string} req.message - Applicant's request message.
   * @param {number} req.id - ID of the join request.
   * @param {string} projectname - Name of the project for which the action applies.
   * @returns {void}
   */
  const openConfirm = (action, req, projectname) => {
    setConfirm({
      action,
      email: req.email,
      id: req.id,
      projectname,
      message: req.message,
      fname: req.fname,
      lname: req.lname,
    });
  };

  /**
   * @function toggleRequestExpand
   * @description
   * Expands or collapses a specific join request card within a project.
   *
   * @param {string} email - The email of the request sender used as key for tracking expansion.
   * @returns {void}
   */
  const toggleRequestExpand = (email) => {
    setExpandedRequest((prev) => ({ ...prev, [email]: !prev[email] }));
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
            {/* Project Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleToggle(projectname)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 px-5 mt-2 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                  {projectname?.charAt(0)?.toUpperCase() || "P"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600">{projectname}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
              </div>

              {expandedProject === projectname ? (
                <ChevronDown size={22} className="text-gray-500" />
              ) : (
                <ChevronRight size={22} className="text-gray-500" />
              )}
            </div>

            {/* Expanded Project Details */}
            <div
              className={`mt-6 border-t pt-6 space-y-8 overflow-hidden transition-all duration-300 ease-out ${
                expandedProject === projectname ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Pending Requests */}
              <div>
                <h4 className="text-md font-semibold text-indigo-700 mb-3">Pending Join Requests</h4>

                {requestLoading ? (
                  <div className="flex justify-center py-4 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Loading...
                  </div>
                ) : requests.length === 0 ? (
                  <p className="text-gray-500 italic">No requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req, idx) => {
                      const isExpanded = !!expandedRequest[req.email];
                      return (
                        <div
                          key={req.email + idx}
                          className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-xl shadow-sm overflow-hidden"
                        >
                          <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleRequestExpand(req.email)}>
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                                {req.fname?.[0]?.toUpperCase() || req.email?.[0]?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <p className="text-gray-800 font-medium flex items-center gap-2">{req.fname} {req.lname}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1"><Mail size={14} className="mr-1" /> {req.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-sm text-gray-500">{req.applied_on ? new Date(req.applied_on).toLocaleDateString() : ""}</div>
                              <div>{isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</div>
                            </div>
                          </div>

                          <div className={`px-4 transition-all duration-300 ease-out ${isExpanded ? "max-h-[600px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}`}>
                            {req.message ? (
                              <div className="mb-3 p-3 bg-gray-50 border-l-4 border-indigo-400 text-sm italic text-gray-700">"{req.message}"</div>
                            ) : (
                              <div className="mb-3 text-sm text-gray-500 italic">No message provided.</div>
                            )}

                            <div className="flex gap-2">
                              <button
                                onClick={() => openConfirm("accept", req, projectname)}
                                className="px-4 py-1.5 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
                              >
                                <UserCheck size={14} /> Accept
                              </button>

                              <button
                                onClick={() => openConfirm("reject", req, projectname)}
                                className="px-4 py-1.5 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600"
                              >
                                <UserX size={14} /> Reject
                              </button>

                              <button
                                className="ml-auto px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200"
                                onClick={() => navigator.clipboard && navigator.clipboard.writeText(req.email)}
                              >
                                Copy Email
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Current Members */}
              <div>
                <h4 className="text-md font-semibold text-indigo-700 mb-3">Current Team Members</h4>

                {membersLoading ? (
                  <div className="flex justify-center py-3 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Loading...
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-gray-500 italic">No members added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {members.map((m, idx) => (
                      <div key={m.member_email + idx} className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-3 transition transform hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">{m.member_fname?.[0]?.toUpperCase() || "X"}</div>
                        <div>
                          <p className="font-medium text-gray-800">{m.member_fname} {m.member_lname}</p>
                          <p className="text-sm text-gray-500">{m.member_email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirm(null)} />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-transform duration-200 ease-out scale-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <MessageCircle className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{confirm.action === "accept" ? "Confirm Accept" : "Confirm Reject"}</h3>
                <p className="text-sm text-gray-600 mt-1">Are you sure you want to {confirm.action === "accept" ? "accept" : "reject"} <strong>{confirm.fname} {confirm.lname}</strong> for <strong>{confirm.projectname}</strong>?</p>
              </div>
            </div>

            {confirm.message && (
              <div className="mt-4 p-3 bg-gray-50 border-l-4 border-indigo-300 italic text-sm text-gray-700">"{confirm.message}"</div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200" onClick={() => setConfirm(null)}>Cancel</button>

              {confirm.action === "accept" ? (
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2" onClick={handleAcceptConfirmed} disabled={requestLoading}>
                  <Check size={16} /> {requestLoading ? "Processing..." : "Yes, Accept"}
                </button>
              ) : (
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2" onClick={handleRejectConfirmed} disabled={requestLoading}>
                  <X size={16} /> {requestLoading ? "Processing..." : "Yes, Reject"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadProjects;
