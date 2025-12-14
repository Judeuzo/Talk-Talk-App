import React from "react";
import Post from "../components/Post.jsx";
import Navbar from "../components/NavBar.jsx";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export default function Profile() {

  const { allUsers,posts,setPosts,user } = useContext(AuthContext);
  const userId=useParams();

  let thisUser;
  
  allUsers?.map((u)=>{
    if(userId.id==u._id){
      thisUser=u
    }
  })

  

  // Example Post Images
  const sampleImages = [
    "/images/food1.jpg",
    "/images/food2.jpg",
    "/images/food3.jpg"
  ];

  return (

    <div className="w-full min-h-screen bg-gray-100">

        {/* NAVBAR */}
      <Navbar />  

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 p-2">

        {/* LEFT PROFILE SECTION */}
        <div className="bg-white p-8 h-fit md:col-span-1">
          <img
            src={thisUser?.avatar}
            alt="profile"
            className="w-48 h-48 object-cover mb-6"
          />

          <h1 className="text-3xl font-semibold mb-1">
            {thisUser?.name}{thisUser?.verified && <span className="material-icons p-1 text-primary">verified</span>}
          </h1>
           <p className="flex items-end mb-3 text-gray-400"><p className="text-4xl">{thisUser?.views}</p>views</p>
          

          {/* EDIT PROFILE BUTTON */}
          
          {user?._id == userId.id && <a
            href="/edit-profile"
            className="bg-primary px-4 py-2 rounded-full text-black font-medium hover:bg-primary/80 transition mb-6 flex items-center gap-2"
          >
            <span className="material-icons">edit</span>
            Edit Profile
          </a>}

          {/* BIO SECTION */}

          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <hr className="mb-4" />

          <p className="text-gray-700 text-sm leading-relaxed">{thisUser?.bio}</p>
        </div>

        {/* RIGHT POSTS SECTION */}
        <div className="md:col-span-2">
          <h2 className="bg-primary text-black px-4 py-3 font-semibold">
            Posts
          </h2>

          <div className=" p-2 ">
            {/* Render thisUser posts */}
            {posts?.map((post)=>{
              if(post?.user._id==thisUser?._id){
                return <Post
                          onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
                          post={post}
                        />
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
