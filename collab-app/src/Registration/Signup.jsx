/**
 * @file Signup.jsx
 * @description
 * React component that provides a registration interface for new users.
 * It allows users to create an account by submitting personal details such as
 * first name, last name, email, password, and proficiency level (Frontend, Backend, or Both).
 * 
 * Upon successful registration, the data is sent to the backend API for account creation.
 * The user is then shown success or error toasts depending on the response.
 * 
 * This file contains two main components:
 *  - `RightPane`: Handles the sign-up form, state management, and API integration.
 *  - `SignUp`: Wrapper component that combines the left informational pane and the signup form.
 * 
 * @author
 * Pranav Singh
 */

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Layers } from "lucide-react";
import LeftPane from "./LeftPane.jsx";
import ErrorToast from "../toasts/ErrorToast.jsx";
import SuccessfulToast from "../toasts/SuccessfulToast.jsx";

/**
 * RightPane Component
 * -------------------
 * Handles user registration logic, form validation, and backend integration.
 *
 * Key Features:
 *  - Accepts user details (name, email, password, proficiency).
 *  - Sends registration data to backend API endpoint.
 *  - Displays success or error toast based on response.
 *  - Clears input fields after successful submission.
 */

function RightPane() {
  /** --------------------------- State Management --------------------------- */
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [prof, setProf] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [created, setCreated] = useState(false);

  /** ------------------------------------------------------------------------
   * @function postData
   * @description
   * Prepares and sends user registration data to the backend API.
   * Depending on the `prof` field, sets the user's proficiency type
   * (Frontend, Backend, or Both).
   * 
   * On success -> clears form and displays success toast.  
   * On failure -> displays error toast.
   * ------------------------------------------------------------------------ */
  const postData = async () => {
    let front = false;
    let back = false;

    // Determine proficiency flags
    if (prof === "frontend") front = true;
    else if (prof === "backend") back = true;
    else {
      front = true;
      back = true;
    }

    const body = {
      firstname: fname,
      lastname: lname,
      email: username,
      password: password,
      frontend: front,
      backend: back,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/accounts/", body);
      setError(false);
      setFname("");
      setLname("");
      setProf("");
      setUsername("");
      setPassword("");
      setCreated(true);
    } catch (error) {
      setCreated(false);
      setError(true);
      console.error("Error creating account:", error);
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description
   * Prevents default form reload and triggers API submission.
   * @param {Event} event - Form submission event
   * ------------------------------------------------------------------------ */
  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData();
  };

  /** ------------------------------------------------------------------------
   * @function closePopUp
   * @description Closes success/error toast popups when dismissed.
   * ------------------------------------------------------------------------ */
  const closePopUp = () => {
    setError(false);
    setCreated(false);
  };

  /** --------------------------- Input Handlers --------------------------- */
  const handleFname = (event) => setFname(event.target.value);
  const handleLname = (event) => setLname(event.target.value);
  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handleProf = (event) => setProf(event.target.value);

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="flex justify-center items-center w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 p-10">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        {/* --------------------------- Header --------------------------- */}
        <div className="flex flex-col items-center mb-6">
          <Layers className="w-12 h-12 text-blue-600 mb-2" />
          <h1
            id="sn-tag"
            className="text-3xl font-bold text-center text-gray-900 mb-2"
          >
            SIGN UP
          </h1>
          <p className="text-center text-gray-600 text-sm">
            Please fill all the necessary details
          </p>
        </div>

        {/* --------------------------- Form --------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name Fields */}
          <div className="flex gap-4">
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition w-1/2">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={fname}
                onChange={handleFname}
                required
                className="w-full outline-none"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition w-1/2">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={lname}
                onChange={handleLname}
                required
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Proficiency Dropdown */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Layers className="w-5 h-5 text-gray-400 mr-2" />
            <select
              value={prof}
              onChange={handleProf}
              required
              className="w-full outline-none bg-transparent"
            >
              <option value="" disabled>
                Select your proficiency
              </option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Username (Email) Field */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="username"
              placeholder="Email"
              value={username}
              onChange={handleUsername}
              required
              className="w-full outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
              required
              className="w-full outline-none"
            />
          </div>

          {/* Toast Messages */}
          {error && (
            <ErrorToast
              error={"Oops! This account already exists"}
              onClose={closePopUp}
            />
          )}
          {created && (
            <SuccessfulToast
              mssg1={"Account Created"}
              mssg2={"You can login now"}
              onClose={closePopUp}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 text-lg flex items-center justify-center gap-2"
          >
            <Layers className="w-5 h-5" /> SIGN UP
          </button>
        </form>

        {/* Redirect to Sign In Page */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link
            to="/"
            className="text-blue-600 hover:underline ml-1 font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * SignUp Component
 * ----------------
 * Wrapper layout that displays the left informational pane (`LeftPane`)
 * and the right signup form (`RightPane`) side by side.
 *
 * @returns {JSX.Element} A responsive sign-up page layout.
 */
function SignUp() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPane />
      <RightPane />
    </div>
  );
}

export default SignUp;