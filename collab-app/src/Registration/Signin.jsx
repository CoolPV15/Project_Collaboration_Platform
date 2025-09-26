import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import './Signin.css';
import axiosInstance from "../Interceptors/axiosInstance";
{/* Author: Pranav Singh*/}

export function LeftPane() {
  {/*
    HTML component for the left pane to display the name of the website
  */}
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 to-blue-500 text-white w-full md:w-1/2 h-screen p-10">
      <h1 id="sitename" className="text-5xl font-extrabold mb-4">PROJECTO</h1>
      <h3 id="sitedsc" className="text-xl font-medium text-center">PROJECT COLLABORATION PLATFORM</h3>
    </div>
  );
}

function RightPane() {
  {/*
    Component designed for the user with existing accounts to sign in 
  */}
    
  {/*
    Using useState to store and constantly update the username and password entered by the user in the specified fields.
  */}
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [checkdata, setData] = useState([]);

  const authenticateData = async (e) => {
    const user = { email: username, password: password };

    try {
      const { data } = await axiosInstance.post("token/", user);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

      console.log("Login Successful");
      navigate('home');
    } catch (error) { 
      console.log("Error Logging in");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    authenticateData();
  }

  {/*
    Updating the username and password with every event being triggered when the user types in the field.
  */}
  const handleusername = (event) => setUsername(event.target.value);
  const handlepass = (event) => setPassword(event.target.value);

  return (
    <div className="flex justify-center items-center w-full md:w-1/2 h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
        <h1 id="sign-in" className="mb-6 text-3xl font-bold tracking-tight text-gray-900 text-center">SIGN IN</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            {/* Username */}
            <label id="usd" htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="Username" 
              value={username} 
              onChange={handleusername} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label id="passw" htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="Password" 
              value={password} 
              onChange={handlepass} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/*Sign In Button*/}
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            SIGN IN
          </button>
        </form>

        {/*Link to redirect to Sign up Page*/}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

function Signin() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <LeftPane />
      <RightPane />
    </div>
  );
}

export default Signin;
