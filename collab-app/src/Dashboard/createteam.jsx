import React, { useState, useContext } from "react";
import axios from "axios";
import Home from "./home";
import {AuthContext} from "../context/AuthProvider.jsx"
import SuccessfulToast from "../toasts/SuccessfulToast.jsx"
{/*Author: Pranav Singh*/}

{/* Component for creating a team */}
function CreateTeam() {
    {/*Using useState for handling Project Name, Description and the requirements*/}
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [need, setNeed] = useState({frontend: true, backend: true})
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const {user} = useContext(AuthContext);

  {/*Function for detecting the description as the user types in the input field and conditional check to make sure
    that the length of the description does not exceed the maximum limit */}
  const handleProjectDescription = (event) => {
    const value = event.target.value;
    if(value.length>250){ 
        setError("Project description must not exceed 250 words")
        return;
    } 
    setCount(value.length);
    setProjectDescription(event.target.value);
  }

  const postProject = async(e) => {
    console.log(user);
    const project = {email:user.email, projectname:projectName, description:projectDescription,frontend:need.frontend,
      backend:need.backend
    }

    try{
      console.log(project);
      const {data} = await axios.post("http://127.0.0.1:8000/api/projectleads/",project);
      console.log("Project Created");
      setCreated(true);
    }catch(error){
      console.log("An error Occured",error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (count > 250) {
      setError("Project description must not exceed 250 words.");
      return;
    }

    postProject();

    setError("");
  };

  const closePopUp = () => {
    setCreated(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Create a New Team
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Project Description (max 250 words)
          </label>
          <textarea
            value={projectDescription}
            onChange= {handleProjectDescription}
            placeholder="Describe your project"
            rows="5"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            Word Count: {count} / 250
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Requirement Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Team Requirements
          </label>
          <div className="mb-5 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="requirement"
                value="frontend"
                checked = {need.frontend === true && need.backend === false}
                onChange = {() => setNeed({
                  ...need,
                  frontend:true,
                  backend:false
                })}
                className="mr-2"
              />
              Frontend Developers
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="requirement"
                value="backend"
                className="mr-2"
                checked = {need.frontend === false && need.backend === true}
                onChange = {() => setNeed({
                  ...need,
                  frontend:false,
                  backend:true
                })}
              />
              Backend Developers
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="requirement"
                value="both"
                className="mr-2"
                checked = {need.frontend === true && need.backend === true}
                onChange = {() => setNeed({
                  ...need,
                  frontend:true,
                  backend:true
                })}
              />
              Both
            </label>
          </div>
          {created && <SuccessfulToast mssg1={"Project Created"} mssg2={""} onClose={closePopUp}/>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}

export default CreateTeam;
