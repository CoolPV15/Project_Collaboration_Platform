/**
 * @file Signin.jsx
 * @description
 * React component that provides a sign-in interface for registered users.
 * It authenticates user credentials against the backend API and grants access
 * to the dashboard upon successful login. The component securely stores
 * authentication tokens, manages login state, and redirects authenticated users.
 * 
 * This file contains two components:
 *  - `RightPane`: The main sign-in form logic and UI.
 *  - `Signin`: A wrapper that combines the left informational pane and the right login form.
 * 
 * @author
 * Pranav Singh
 */

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Users, Key } from "lucide-react";
import axios from "axios";
import LeftPane from "./LeftPane.jsx";
import ErrorToast from "../toasts/ErrorToast";
import axiosInstance from "../Interceptors/axiosInstance";
import { AuthContext } from "../context/AuthProvider.jsx";

/**
 * RightPane Component
 * -------------------
 * Handles user authentication for existing accounts.
 * It provides input fields for email and password, validates credentials,
 * and navigates users to the dashboard upon successful login.
 *
 * Key Features:
 *  - Authenticates users via backend JWT API.
 *  - Stores tokens in localStorage for persistent login sessions.
 *  - Displays contextual error messages for invalid credentials.
 *  - Redirects users who are already logged in.
 */

function RightPane() {
  /** --------------------------- State Management --------------------------- */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuthTokens } = useContext(AuthContext);

  /** ------------------------------------------------------------------------
   * @function useEffect
   * @description Redirects users to the home dashboard if already logged in.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    if (localStorage.getItem("islogged") === "true") {
      navigate("home");
    }
  }, []);

  /** ------------------------------------------------------------------------
   * @function authenticateData
   * @description
   * Sends user credentials (email and password) to the backend API for authentication.
   * On success, stores access and refresh tokens in localStorage and updates
   * the global authentication context.
   * 
   * On failure, displays an error message.
   * ------------------------------------------------------------------------ */
  const authenticateData = async () => {
    const user = { email: username, password: password };

    try {
      const { data } = await axiosInstance.post("token/", user);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("islogged", "true");
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      console.log("Login Successful");
      setAuthTokens(data);
      navigate("home");
    } catch (error) {
      setError("Invalid Credentials");
      console.error("Error Logging in:", error);
    }
  };

  /** ------------------------------------------------------------------------
   * @function useEffect
   * @description
   * Listens for changes in localStorage to synchronize login status across tabs.
   * Automatically redirects to home if login occurs elsewhere.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "islogged" && e.newValue === "true") {
        navigate("home");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description
   * Handles the login form submission, prevents page reload,
   * and triggers user authentication.
   * 
   * @param {Event} event - Form submission event
   * ------------------------------------------------------------------------ */
  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateData();
  };

  /** ------------------------------------------------------------------------
   * @function closePopUp
   * @description Closes the error toast popup when dismissed.
   * ------------------------------------------------------------------------ */
  const closePopUp = () => {
    setError(false);
  };

  /** ------------------------------------------------------------------------
   * @function handleusername
   * @description Updates the username state as the user types.
   * @param {Event} event - Input change event
   * ------------------------------------------------------------------------ */
  const handleusername = (event) => setUsername(event.target.value);

  /** ------------------------------------------------------------------------
   * @function handlepass
   * @description Updates the password state as the user types.
   * @param {Event} event - Input change event
   * ------------------------------------------------------------------------ */
  const handlepass = (event) => setPassword(event.target.value);

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="flex justify-center items-center w-full md:w-1/2 h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        {/* --------------------------- Header --------------------------- */}
        <div className="flex flex-col items-center mb-6">
          <Users className="w-12 h-12 text-blue-600 mb-2" />
          <h1
            id="sign-in"
            className="text-3xl font-bold tracking-tight text-gray-900 text-center"
          >
            SIGN IN
          </h1>
          <p className="text-gray-500 mt-1 text-sm text-center">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {/* --------------------------- Form Section --------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <label
              id="usd"
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition duration-300">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                name="Username"
                value={username}
                onChange={handleusername}
                required
                placeholder="Enter your email"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              id="passw"
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition duration-300">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                name="Password"
                value={password}
                onChange={handlepass}
                required
                placeholder="Enter your password"
                className="w-full outline-none"
              />
            </div>
            {error && <ErrorToast error={error} onClose={closePopUp} />}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 text-lg flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" /> SIGN IN
          </button>
        </form>

        {/* Redirect to Signup */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            className="text-blue-600 hover:underline ml-1 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * Signin Component
 * ----------------
 * Wrapper component that combines the left informational pane
 * (`LeftPane`) and the right login form (`RightPane`).
 *
 * @returns {JSX.Element} A responsive layout containing both panes.
 */

function Signin() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPane />
      <RightPane />
    </div>
  );
}

export default Signin;
