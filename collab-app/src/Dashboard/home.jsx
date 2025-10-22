import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Interceptors/axiosInstance";
import Logout from "./Logout.jsx";
import CreateTeam from "./createteam.jsx";
import JoinTeam from "./jointeam.jsx";
import MyTeams from "./myteams.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";

/* Author: Pranav Singh */

function Home() {
  const { user, loginUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("create");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/");
    } else {
      (async () => {
        try {
          const { data } = await axiosInstance.get("accounts/home/");
          loginUser(data);
          console.log(data);
        } catch (error) {
          console.log("Not Authorized");
          navigate("/");
        }
      })();
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "islogged" && event.newValue === "false") {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold text-center py-6 border-b">
          PROJECTO
        </h2>
        <nav className="flex-1 px-4 py-6 space-y-3">
          <button
            onClick={() => setActiveTab("create")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "create"
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Create a Team
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "join"
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            Join a Team
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "teams"
                ? "bg-blue-500 text-white shadow-md"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            My Teams
          </button>
        </nav>

        <div className="border-t p-4">
          <Logout />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Compact Horizontal Profile Card */}
        {user && (
          <div className="flex justify-end mb-8">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition p-5 flex items-center space-x-4 w-[420px]">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="No user"
                />
              </div>

              {/* User Details */}
              <div className="flex flex-col flex-grow">
                <p className="font-semibold text-lg text-gray-800">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-gray-500 text-sm mb-1">{user.email}</p>

                <div className="flex gap-2 mt-1">
                  {user.frontend && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      Frontend
                    </span>
                  )}
                  {user.backend && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Backend
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Tab Content */}
        {activeTab === "create" && <CreateTeam />}
        {activeTab === "join" && <JoinTeam />}
        {activeTab === "teams" && <MyTeams />}
      </div>
    </div>
  );
}

export default Home;
