import React from 'react'
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

   const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login(form.email, form.password);

  };

  return (
    <div className="bg-white rounded-[40px] p-10 flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-center leading-tight">
        Login
      </h2>

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleLogin}>
       
        <input
          type="email"
          placeholder="email"
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="password"
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="bg-[#B7EBA4] mt-2 w-full py-3 cursor-pointer rounded-full text-black text-lg hover:opacity-70"
        >
          Login
        </button>
        <div>
          <p className='text-xs text-center text-gray-400'>By creating an account you agree to our <a href='' className=' text-blue-500 cursor-pointer'>Terms of services</a> and <a href="" className='cursor-pointer text-blue-500 '>privacy policy</a></p>
                <p className='text-xs text-center text-gray-400 '>Dont have an account ? <a href="/" className='cursor-pointer text-blue-500 '>signUp</a> </p>
        </div>
      </form>
    </div>
  )
}

export default Login
