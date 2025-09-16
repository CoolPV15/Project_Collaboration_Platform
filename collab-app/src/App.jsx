import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Signup from "./Registration/Signup.jsx"
import Signin from "./Registration/Signin.jsx"
import './App.css'

function App() {
  {/*
    Using Routers for efficient navigation between different web pages in the website
    */}
  return(
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Signin />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      </Routes>
    </Router>
    </>
  )

}

export default App