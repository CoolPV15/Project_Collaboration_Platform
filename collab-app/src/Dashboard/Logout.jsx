import React from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../Interceptors/axiosInstance';
{/*Author: Pranav Singh*/}

function Logout() {
    const navigate = useNavigate();

    const handleLogOut = async () => {
        // Capturing the refresh token
        const refresh_token = localStorage.getItem("refresh_token");
        localStorage.setItem("islogged","false");

        if (!refresh_token) {
            // If no token is set, clearing the localStorage and redirecting to the login page
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];
            navigate("/");
            return;
        }   

        try {
            // Calling the logout API only if refresh token exists
            await axiosInstance.post("accounts/logout/", { refresh_token });

            // Clearing the tokens after successful logout
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];

            navigate("/");
        } catch (error) {
            console.log("Logout Failed", error.response?.data || error);

            // Even if logout API fails, clearing the tokens and redirecting to the login page
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.setItem("islogged","false");
            delete axiosInstance.defaults.headers["Authorization"];

            navigate("/");
        }
    };

    return(
        <button onClick = {handleLogOut}>Logout</button>
    );
}

export default Logout