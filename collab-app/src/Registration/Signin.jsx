import { useState } from "react";
import {BrowserRouter as Router, Link, Routes,Route} from "react-router-dom"
import './Signin.css'
import Signup from "./Signup"


export function LeftPane(){
  {/*
    HTML component for the left pane to display the name of the website
    */}
  return(
    <>
      <div id ="leftside" class="left-float">
      <div class = "holdbanner">
        <h1 id="sitename">PROJECTO</h1>
        <h3 id="sitedsc">PROJECT COLLABORATION PLATFORM</h3>
      </div>
    </div>
    </>
  )
}

function RightPane(){
  {/*
    Component designed for the user with exisiting accounts to sign in 
    */}
    
  {/*
    Using useState to store and constantly update the username and password entered by the user in the specified filled.
    */}
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const handleSubmit = (event) => {
    let userid = username;
    let pass = password;
    alert(`Your username is ${username} and password is ${password}`);
  }

  {/* 
    Updating the username and password with every event being triggered as the user types in the field.
    */}

  const handleusername = (event) => {
    setUsername(event.target.value);
  }

  const handlepass = (event) => {
    setPassword(event.target.value);
  }

  return(
    <>
    <div id="rightside" class="right-float">
      <div class ="loginbar">
        <h1 id="sign-in">SIGN IN</h1>
        <div class = "id-check">
          <form onSubmit={handleSubmit}>
            <label id = "usd" htmlFor="username">Username</label>
            <br/>
            <div class="inp-username">
              <input type="email" name="Username" value={username} onChange={handleusername} required/>
            </div>
            <label id="passw" htmlFor="password">Password</label>
            <br/>
            <div class="inp-pass">
              <input type="password" name="Password" value={password} onChange={handlepass} required/>
            </div>
            <div class="button-scope">
            <div class="sign-in-button">
              <button type="submit">SIGN IN</button>
            </div>
            </div>
          </form>
        </div>
      </div>
      
        <p>Don't have an account?
            <Link to="/signup">Sign Up</Link>
        </p>
    </div>
    </>
  )
}

function Signin(){

  return(
    <>
    <title>Projecto</title>
    <div class = "float-container">
      <LeftPane />
      <RightPane />
    </div>
    </>
  )
}

export default Signin