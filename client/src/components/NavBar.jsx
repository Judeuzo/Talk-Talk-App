import React, { useState, useEffect, useRef,useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function NavBar() {

    const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const { logout,user } = useContext(AuthContext);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
return (

<nav className="w-full sticky top-0 z-50 bg-primary px-6 py-4 flex justify-between items-center shadow">
      {/* Logo */}
      <img src="/Talk Talk FULL WHITE.png" className="w-[50%] md:w-[20%]" alt="" />

      {/* Profile Icon + Dropdown */}
      <div className="relative" ref={menuRef}>
        <span
          className="material-icons text-3xl cursor-pointer hover:opacity-70 transition"
          onClick={() => setOpenMenu(!openMenu)}
        >
          menu
        </span>

        {/* Dropdown menu */}
        {openMenu && (
          <div
            className="absolute right-0 top-13 bg-black min-w-30 text-black border-b-10 border-primary animate-fadeIn"
          >
            <ul className="space-y-4 flex flex-col p-3 text-center divide-white text-white text-sm">
              <a href="/NewsFeed" className="cursor-pointer hover:opacity-70 transition">Topics</a>
              <a href={`/profile/${user._id}`} className="cursor-pointer hover:opacity-70 transition">
                Profile
              </a>
              <a href={`/feedBack`} className="cursor-pointer hover:opacity-70 transition">
                Feedback
              </a>
              {user?.admin && <a href={`/admin`} className="cursor-pointer hover:opacity-70 transition">
                Admin
              </a>}
              <a onClick={()=>logout()}className="cursor-pointer hover:opacity-70 transition">
                Logout
              </a>
            </ul>
          </div>
        )}
      </div>
    </nav>

);
}

