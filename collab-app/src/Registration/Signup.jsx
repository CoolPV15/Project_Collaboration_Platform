import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Signup.css';
import LeftPane from './LeftPane.jsx'
import ErrorToast from "../toasts/ErrorToast.jsx";
import SuccessfulToast from "../toasts/SuccessfulToast.jsx";
{/* Author: Pranav Singh*/}

function SignUp() {
  {/*
      Component designed for the new users to sign up in their account
  */}

  {/*
      Using useState for handling all the data entered by the user in the specified field, that includes,
      "First Name", "Last Name", "Username", "Password" and a variable to store the proficiency of the user,
      which includes options to select from, i.e., Frontent, Backend or both
  */}

  const endpoint = `${import.meta.env.login_api_url}/accounts/`;
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [prof, setProf] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [created,setCreated] = useState(false);
  {/*
      Sending the data of the user on the backend after form submission, along with an alert containing a success
      message or an error message
  */}
  const postData = async (event) => {
    let front = false;
    let back = false;
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
      backend: back
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/accounts/", body);
      setError('');
      setFname("");
      setLname("");
      setProf("");
      setUsername("");
      setPassword("");
      setCreated(true);
    } catch (error) {
      setCreated(false);
      setError(true);
      console.log(error, "Error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await postData();
  };

  const closePopUp = () => {
    setError(false);
    setCreated(false);
  }

  const handleFname = (event) => setFname(event.target.value);
  const handleLname = (event) => setLname(event.target.value);
  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);
  const handleProf = (event) => setProf(event.target.value);

  return (
    <>
      <title>Sign Up</title>
      <div className="flex flex-col md:flex-row min-h-screen">
        <LeftPane />

        <div className="flex justify-center items-center w-full md:w-1/2 bg-gray-50 p-10">
          <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
            <h1 id="sn-tag" className="text-3xl font-bold text-center text-gray-900 mb-4">SIGN UP</h1>
            <p className="text-center text-gray-600 mb-6">Please fill all the necessary details</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First and Last Name */}
              <div className="flex gap-4">
                <input
                  type="text"
                  name="fname"
                  placeholder="First Name"
                  value={fname}
                  onChange={handleFname}
                  required
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="lname"
                  placeholder="Last Name"
                  value={lname}
                  onChange={handleLname}
                  required
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Proficiency */}
              <select
                value={prof}
                onChange={handleProf}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select your proficiency</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="both">Both</option>
              </select>

              {/* Username */}
              <input
                type="email"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleUsername}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePassword}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && <ErrorToast error={"Oops! This account already exists"} onClose = {closePopUp}/>}
              {created && <SuccessfulToast mssg1={"Account Created"} mssg2={"You can login now"} onClose={closePopUp}/>}
              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                SIGN UP
              </button>
            </form>

            {/*Link to redirect to Sign In Page*/}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?
              <Link to="/" className="text-blue-600 hover:underline ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
