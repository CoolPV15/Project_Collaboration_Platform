import { useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import './Signin.css';
import LeftPane from './LeftPane.jsx'
import ErrorToast from "../toasts/ErrorToast";
import axiosInstance from "../Interceptors/axiosInstance";
import { AuthContext } from "../context/AuthProvider.jsx";
{/* Author: Pranav Singh*/}

function RightPane() {
  {/*
    Component designed for the user with existing accounts to sign in 
  */}
    
  {/*
    Using useState to store and constantly update the username and password entered by the user in the specified fields.
  */}
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setAuthTokens} = useContext(AuthContext);

  {/*Navigating to the Home dashboard if the user is already logged in*/}
  useEffect(() =>{
    if(localStorage.getItem("islogged")==="true"){
      navigate("home");
    }
  },[]);

  const authenticateData = async (e) => {
    const user = { email: username, password: password };

    try {
      const { data } = await axiosInstance.post("token/", user);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem("islogged","true");
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      console.log("Login Successful");
      setAuthTokens(data);
      navigate('home');
    } catch (error) { 
      setError("Invalid Credentials");
      console.log("Error Logging in");
    }
  }


  useEffect(() =>{
    const handleStorageChange = (e) => {
      if(e.key==="islogged" && e.newValue=="true"){
        navigate("home");
      }
    }

    window.addEventListener("storage",handleStorageChange);

    return () => window.removeEventListener("storage",handleStorageChange);
  },[])

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
            {error && <ErrorToast error={error}/>}
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
