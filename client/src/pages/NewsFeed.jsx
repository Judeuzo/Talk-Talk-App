import React, { useState, useContext,useEffect } from "react";
import Post from "../components/Post";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import axios, { all } from "axios";
import FloatingMenu from "../components/FloatingMenu";


export default function NewsFeed() {

  const { token,createPost,getAllPosts,posts,setPosts } = useContext(AuthContext);

  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!caption.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append("caption", caption);
    for (let i=0;i<images.length;i++){
        formData.append('images',images[i]);
    }

    try {
      setLoading(true);

      await createPost(formData).then(()=>{setCaption("");setImages([]);setOpenCreatePost(false);setPreviewImages([])});

    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar />
    <div className="bg-gray-100 min-h-screen overflow-x-hidden relative">

      <div className="pt-3 flex flex-col items-center">

        {/* ================= FIXED CREATE POST BUTTON ================= */}
        {!openCreatePost && (
          <button
            onClick={() => setOpenCreatePost(true)}
            className="fixed bottom-6 left-6 bg-primary hover:bg-yellow-300 
                       text-black font-semibold px-5 py-3 rounded-full shadow-xl z-50"
          >
            Create Post
          </button>
        )}

        {/* ================= MODAL ================= */}
        {openCreatePost && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm 
                          flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">

              <h2 className="text-xl font-semibold mb-4">Create Post</h2>

              <form onSubmit={handleCreatePost} encType="multipart/form-data">

                {/* Caption */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  rows="3"
                  placeholder="What's on your mind?"
                ></textarea>
                <p className="text-xs text-gray-400">Topics lasts for only 24 hours</p>

                {/* File input */}
                <div className="mt-3">
                  <label className="font-medium">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="block mt-1"
                  />
                </div>

                {/* Preview */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {previewImages.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="mt-5 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setOpenCreatePost(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-primary hover:bg-yellow-300 rounded-lg font-semibold"
                  >
                    {loading ? "Posting..." : "Post"}
                  </button>
                  
                </div>
                
              </form>
            </div>
          </div>
        )}

        {/* ================= EXISTING STATIC POST ================= */}
        {
          posts?.map((post)=>{
            return <Post
          onDelete={(id) => {setPosts(posts.filter(p => p._id !== id));console.log(posts)}}
          post={post}
        />
          })
        }
      </div>
    </div>
    </>
  );
}
