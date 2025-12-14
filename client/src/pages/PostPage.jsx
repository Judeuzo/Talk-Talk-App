import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import AudioRecorder from "../components/AudioComment";
import Loading from "../components/Loading";

export default function PostPage() {
  const { id } = useParams();

  const { posts,submitToBackend,getAllPosts,setPosts,
     } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [newAdioComment, setNewAdioComment] = useState(null);

    useEffect(() => {
  if (!posts) getAllPosts();
}, [posts, getAllPosts]);


  const post = posts?.find((p) => p._id === id);

  const handleAudioUpload = async ({ file, duration }) => {
  setLoading(true)
  if (!file) return alert("No audio file to upload");

  const formData = new FormData();
  formData.append("audio", file);
  formData.append("postId", id);
  formData.append("duration", duration); // optional if you want to store length

  try {
    const res = await submitToBackend(formData, id);
    res?setLoading(false):null
    setNewAdioComment(res.audioComment);
    console.log("Upload success:", res);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};



  if (!post)
    return (
      <div className="text-center mt-20 text-red-600 text-lg">
        <Navbar className="relative" />
        Post not found
      </div>
    );


  return (

    <div className="w-full border h-full"> {/* spacing for fixed navbar */}
      <Navbar className="relative" />

      <div className="">
        <Post
          onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
          post={post}
          newAdioComment={newAdioComment}
        />
        <AudioRecorder onRecorded={handleAudioUpload}/>
        {loading && <Loading message="Sending audio..."/>}
      </div>
    </div>
  );
}
