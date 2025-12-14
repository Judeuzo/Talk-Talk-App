import React from 'react';
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";

const SignUp = () => {

  const { signup } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

   const handleSignup = async (e) => {
    e.preventDefault();

    const res = await signup(form.name, form.email, form.password);

    if (res.success) {
      alert("Signup successful!");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-10 flex flex-col w-full max-w-md">
      <h2 className="text-3xl font-bold text-center leading-tight">
        Create <br /> Account
      </h2>

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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
          className="bg-[#B7EBA4] mt-2 w-full py-3 rounded-full text-black text-lg hover:opacity-70"
        >
          Create Account
        </button>
        <div>
          <p className='text-xs text-center text-gray-400'>By creating an account you agree to our <a href='' className=' text-blue-500 cursor-pointer'>Terms of services</a> and <a href="" className='cursor-pointer text-blue-500 '>privacy policy</a></p>
                <p className='text-xs text-center text-gray-400 '>Already have an account ? <a href="login" className='cursor-pointer text-blue-500 '>login</a> </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp
