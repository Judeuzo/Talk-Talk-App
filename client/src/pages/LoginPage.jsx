import React from 'react'
import Login from '../components/Login'
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  user && navigate("/newsfeed");


  return (
    <div className="h-screen w-full bg-[#B7EBA4] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SECTION */}
        <div className="flex flex-col items-center">
          <img 
            src="Talk Talk FULL WHITE.png" 
            alt="chat bubbles" 
            className=""
          />
          
          <p className="text-lg">Join in on the global discuss</p>

          {/* Replace the image below with your asset */}
          
        </div>

        {/* RIGHT SECTION */}
        <Login />
      </div>
    </div>
  )
}

export default LoginPage
