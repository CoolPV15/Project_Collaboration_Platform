import { useState } from "react"
import axios from "axios"
import {BrowserRouter as Router, Link} from "react-router-dom"
import './Signup.css'
import {LeftPane} from "./Signin.jsx"

function SignUp(){
    {/*
        Component designed for the new users to sign up in their account
        */}

    {/*
        Using useState for handling all the data entered by the user in the specified field
        */}
        
    const [fname,setFname] = useState('');
    const [lname,setLname] = useState('');
    const [prof, setProf] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    }

    const handleAlert = () => {
        event.preventDefault();
        alert(`Your data is: ${fname} ${lname} ${prof} ${username} ${password}`);
    }

    const handleFname = (event) => {
        setFname(event.target.value);
    }

    const handleLname = (event) => {
        setLname(event.target.value);
    }

    const handleUsername = (evemt) => {
        setUsername(event.target.value);
    }

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleProf = (event) => {
        setProf(event.target.value);
    }

    return(
        <>
        <title>Sign Up</title>
        <div class="main-t">
        <LeftPane/ >
        <div class="main-tab">
            <div class="mid-tab">
            <div class="sign-in">
                <h1 id="sn-tag"><solid>SIGN UP</solid></h1>
                <p>Please fill all the necessary details</p>
                <div class="sign-up-form">
                    <form onSubmit={handleSubmit}>
                    
                    <div class="name">
                    <label htmlFor="fname">
                    <div class="fn-name">
                        <input type="text" name="fname" htmlFor="fname" placeholder="First Name" onChange={handleFname} required/>
                    </div>
                    </label>

                    <label htmlForm="lname">
                    <div class="ln-name">
                        <input type="text" name="lname" htmlFor="lname" placeholder="Last Name" onChange={handleLname} required/>
                    </div>
                    </label>
                    </div>

                    <label htmlFor="prof-sel">
                        <div class="sel-menu">
                        <select id="prof-sel" onChange={handleProf} required>
                            <option value="" disabled selected hidden>Select your proficiency</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="both">Both</option>
                        </select>
                        </div>
                    </label>

                    <label htmlFor="username">
                    <div class="us-name">
                        <input type="email" name="username" htmlFor="username" placeholder="Username" onChange={handleUsername} required/>
                    </div>
                    </label>

                    <label htmlForm="password">
                    <div class="pass">
                        <input type="password" name="passwprd" htmlFor="password" placeholder="Password" onChange={handlePassword} required/>
                    </div>
                    </label>

                    <div class="sign-up-button">
                        <button type="submit">SIGN UP</button>
                    </div>

                    </form>
                </div>

            <p>Already have an account?</p>
                <Link to="/">Sign In</Link>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default SignUp