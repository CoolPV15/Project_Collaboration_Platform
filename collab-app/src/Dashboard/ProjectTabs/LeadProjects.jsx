/**
 * @file LeadProjects.jsx
 * @description 
 * React component that displays all projects created by the authenticated user (as a team lead),
 * allowing them to manage join requests from other users. Each project can be expanded to show
 * pending join requests with applicant details and actions to accept or reject requests.
 * The component interacts with backend APIs to fetch the user’s projects and their corresponding
 * join requests dynamically through a clean, responsive UI.
 * @author Pranav Singh
 */

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { Users, ChevronRight, ChevronDown, Loader2, Mail, User } from "lucide-react";

/**
 * LeadProjects Component
 * -------------------------
 * This component enables project leads to:
 *  - View all projects they have created.
 *  - Expand each project to view join requests from other users.
 *  - Review request details such as applicant name, email, and message.
 *  - Accept or reject incoming requests
 *
 * The component fetches data from backend endpoints:
 *  - `/api/projectleads/` — fetches all projects created by the logged-in user.
 *  - `/api/projectrequestsdisplay/` — fetches join requests for a specific project.
 */

function LeadProjects() {
  /** --------------------------- State Management --------------------------- */
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Tracks project fetch state
  const [leadProjects, setLeadProjects] = useState([]); // List of projects created by user
  const [expandedProject, setExpandedProject] = useState(null); // Currently expanded project
  const [requests, setRequests] = useState([]); // Join requests for the expanded project
  const [requestLoading, setRequestLoading] = useState(false); // Loading state for requests

  /** ------------------------------------------------------------------------
   * @function useEffect
   * @description Fetches all projects created by the authenticated user.
   *              Triggered once the user data is available.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!user) return;

    const fetchLeadProjects = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/projectleads/", {
          params: { email: user.email },
        });
        setLeadProjects(response.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadProjects();
  }, [user]);

  /** ------------------------------------------------------------------------
   * @function fetchRequests
   * @description Fetches join requests for a specific project owned by the user.
   * @param {string} projectName - The name of the project to fetch requests for.
   * ------------------------------------------------------------------------ */
  const fetchRequests = async (projectName) => {
    if (!user) return;
    setRequestLoading(true);

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/projectrequestsdisplay/", {
        params: { email: user.email, projectname: projectName },
      });
      console.log(response);
      setRequests(response.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setRequestLoading(false);
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleToggleProject
   * @description Handles the expand/collapse functionality for each project card.
   *              Expands the card and fetches join requests if not already expanded.
   * @param {string} projectName - The name of the selected project.
   * ------------------------------------------------------------------------ */
  const handleToggleProject = (projectName) => {
    if (expandedProject === projectName) {
      setExpandedProject(null);
      setRequests([]);
    } else {
      setExpandedProject(projectName);
      fetchRequests(projectName);
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleAccept
   * @description 
   * Accepts a join request for the specified project.  
   * This function:
   *  - Validates the logged-in user.
   *  - Sends a POST request to `/api/projectmembers/` to make the applicant a member.
   *  - Deletes the corresponding request record from `/api/projectrequests/{id}/`.
   * 
   * This function is triggered when the project lead clicks the **Accept** button
   * for an incoming join request inside an expanded project section.
   *
   * @param {string} member_email - Email of the applicant requesting to join.
   * @param {string} projectname - Name of the project to which the user wants to join.
   * @param {number} id - Unique request ID used for deleting the request after acceptance.
   *
   * @returns {void}
   * ------------------------------------------------------------------------ */

  const handleAccept = (member_email,projectname,id) => {
    if(!user) return;
    setRequestLoading(true);
    console.log(id);

    const data = {owner:user.email, email:member_email, projectname:projectname};

    try{
      const response = axios.post("http://127.0.0.1:8000/api/projectmembers/",data);
      if(response){
        try{
          const delete_record = axios.delete(`http://127.0.0.1:8000/api/projectrequests/${id}/`);
        }
        catch(error){
          console.log("Error deleting data",error)
        }
      }
    }
    catch(error){
      console.log("Error accepting request",error);
    }
  }
  
  /** ------------------------------------------------------------------------
   * @function handleReject
   * @description 
   * Rejects a join request for the specified project.  
   * This function:
   *  - Validates the logged-in user.
   *  - Sends a POST request to `/api/projectreject/` to record the rejection.
   *  - Deletes the original request record from `/api/projectrequests/{id}/`.
   *
   * This function is triggered when the project lead clicks the **Reject** button
   * for a request inside the expanded project section.
   *
   * @param {string} member_email - Email of the applicant whose request is being rejected.
   * @param {string} projectname - Name of the project for which the request was sent.
   * @param {number} id - Unique request ID used to delete the request after rejection.
   *
   * @returns {void}
   * ------------------------------------------------------------------------ */

  const handleReject = (member_email,projectname,id) => {
    if(!user) return;
    setRequestLoading(true);

    const data = {owner:user.email, email:member_email, projectname:projectname};

    try{
      const response = axios.post("http://127.0.0.1:8000/api/projectreject/",data);
      if(response){
        try{
          const delete_record = axios.delete(`http://127.0.0.1:8000/api/projectrequests/${id}/`);
        }
        catch(error){
          console.log("Error deleting data",error)
        }
      }
    }
    catch(err){
      console.log("Error rejecting request",err);
    }
  }

  /** --------------------------- Conditional Rendering --------------------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading your teams...
      </div>
    );
  }

  if (leadProjects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center text-gray-500 py-10">
        <Users size={48} className="mb-2 text-gray-400" />
        <p>No created teams found.</p>
      </div>
    );
  }

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="space-y-6">
      {leadProjects.map((project) => (
        <div
          key={project.projectname}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6"
        >
          {/* --------------------------- Project Header --------------------------- */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => handleToggleProject(project.projectname)}
          >
            <div>
              <h3 className="text-lg font-semibold text-indigo-600">
                {project.projectname}
              </h3>
              <p className="text-sm text-gray-600">
                {project.description || "No description available."}
              </p>
            </div>
            {expandedProject === project.projectname ? (
              <ChevronDown className="text-gray-500" />
            ) : (
              <ChevronRight className="text-gray-500" />
            )}
          </div>

          {/* --------------------------- Expanded Request Section --------------------------- */}
          {expandedProject === project.projectname && (
            <div className="mt-5 border-t pt-5">
              {/* Loading Requests */}
              {requestLoading ? (
                <div className="flex items-center justify-center py-6 text-gray-500">
                  <Loader2 className="animate-spin mr-2" /> Loading requests...
                </div>
              ) : requests.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No join requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((req, index) => (
                    <div
                      key={req.email + index}
                      className="bg-gradient-to-r from-indigo-50 to-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow transition"
                    >
                      {/* --------------------------- Request Header --------------------------- */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-gray-800 font-medium text-base">
                            <User size={16} className="text-indigo-600" />
                            {req.fname} {req.lname}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Mail size={14} className="text-gray-400" />
                            {req.email}
                          </div>
                        </div>

                        {/* --------------------------- Action Buttons --------------------------- */}
                        <div className="flex gap-2 mt-2 sm:mt-0">
                          <button onClick = {() => handleAccept(req.email,project.projectname,req.id)} className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Accept
                          </button>
                          <button onClick = {() => handleReject(req.email,project.projectname,req.id)} className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* --------------------------- Optional Message Section --------------------------- */}
                      {req.message && (
                        <div className="mt-3 bg-gray-50 border-l-4 border-indigo-400 text-gray-700 text-sm p-3 rounded-md italic">
                          “{req.message}”
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default LeadProjects;