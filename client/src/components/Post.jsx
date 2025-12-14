import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate,useLocation } from "react-router-dom";
import Comments from "./Comments";
import OptionModal from "./OptionModal";

export default function Post({
  postId,
  userId,
  author,
  avatar,
  images = [],
  views,
  likes,
  caption,
  onDelete,
  expiresAt,
  post,
  newAdioComment
}) {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioComments,setAudioComments]= useState(null)
  const [timeLeft, setTimeLeft] = useState("");
  const [modal, setModal] = useState(false);
  const location = useLocation();
  

  const { user, deletePost,getAudioComments,likePost } = useContext(AuthContext);
  const navigate = useNavigate();

  // Path to your beep sound (can be local or hosted)
  const beepSound = "https://orangefreesounds.com/wp-content/uploads/2023/04/High-pitched-beep-sound-effect.mp3"; // <-- make sure this file exists in public folder

  // Play all comments starting from first
  const handlePlayAll = async (e) => {
    e.stopPropagation();
    if (!audioComments || audioComments.length === 0) return;
    setIsPlaying(true);
    setIsPaused(false);
    playBeepThenAudio(0);
  };

  useEffect(() => {
  if (audioComments) return; // ✅ do nothing if comments already loaded

  const loadComments = async () => {
    const res = await getAudioComments(post._id);
    if (res) {
      setAudioComments(res); // ✅ store comments
    }
  };

  !audioComments && loadComments();
}, []);

/// Update audioComments anytime there is a new one

useEffect(()=>{
  if(newAdioComment){
    setAudioComments([...audioComments, newAdioComment])
  }
},[newAdioComment])

/// To set expiry time for post

  useEffect(() => {
    
    if (!post?.expiresAt) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(post?.expiresAt);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      let seconds = Math.floor(diff / 1000);
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60);
      seconds %= 60;

      let text = "Expires in ";

      if (hours > 0) text += `${hours}h `;
      if (minutes > 0) text += `${minutes}m `;
      text += `${seconds}s`;

      setTimeLeft(text.trim());
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [post?.expiresAt]);


  

  // Play beep first, then audio comment
  const playBeepThenAudio = (index) => {
    const beep = new Audio(beepSound);
    beep.play();
    beep.onended = () => {
      setCurrentIndex(index);
    };
  };

  // PAUSE
  const handlePause = (e) => {
    e.stopPropagation();
    setIsPaused(true);
  };

  // RESUME
  const handleResume = (e) => {
    e.stopPropagation();
    setIsPaused(false);
    setIsPlaying(true);
  };

  // STOP
  const handleStop = (e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(null);
  };

  // Move to next comment after one ends
  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < audioComments.length) {
      playBeepThenAudio(next);
    } else {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentIndex(null);
    }
  };

  /* DELETE POST HANDLER */
  const handleDelete = async () => {
    setModal(false)
    const res = await deletePost(post?._id);
    if (res.success) onDelete?.(post?._id);
    
  };

  return (
    <>
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <img
            src={fullscreenImage}
            alt="fullscreen"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
          <span
            className="material-icons absolute top-6 right-6 text-white text-4xl cursor-pointer"
            onClick={() => setFullscreenImage(null)}
          >
            close
          </span>
        </div>
      )}
      
      {modal && (
        <OptionModal
          isOpen={modal}
          title='Delete Post'
          message='Do you want to delete this post?'
          onConfirm={handleDelete}
          onCancel={() => setModal(false)}
        />
      )}

      <div
        onClick={() => location.pathname!=`/post/${post?._id}`?navigate(`/post/${post?._id}`):null}
        className="bg-white w-full cursor-pointer max-w-4xl mx-auto  p-6 mt-2 relative"
      >

          <details onClick={(e)=>e.stopPropagation()} className="absolute top-10 text-xs right-8 cursor-pointer" >
            <summary>options</summary>

            <ul className="bg-primary text-xs p-1 mt-2">
                            {(user?._id === post?.user?._id || user?.admin) && (
                  <li onClick={()=>setModal(true)}>Delete</li>
                )}

            </ul>

          </details>

        {/* PROFILE PICTURE AND NAME */}

        <div className="flex items-center gap-4 mb-4" onClick={(e) => {e.stopPropagation;navigate(`/profile/${post.user._id}`)}}>
          <img src={post.user.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <h2 className="text-lg font-semibold">{post.user.name}</h2>
          {post.user.verified && <span className="material-icons text-primary">verified</span>}
        </div>

        {post.caption && <p className="text-gray-700 mb-2 text-m">{post.caption}</p>}

        { post.images[0] && (post?.images.length === 1 ? (
          <div className="mb-6 ">
            <img
              src={post?.images[0].url}
              alt="single"
              className="w-full max-h-[400px] object-cover rounded-lg cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(post?.images[0].url);
              }}
            />
          </div>
         ) : (
          <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {post?.images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                className="max-h-150 w-auto rounded-lg object-cover cursor-pointer flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenImage(img.url);
                }}
              />
            ))}
          </div>
        )) }

        <div className="text-right text-xs text-gray-400 mb-2">
        {timeLeft}
        </div>

        {/* METRICS */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="material-icons cursor-pointer text-xl">visibility</span>
              <span className="text-sm">{post?.views}</span>
            </div>

            <div className="flex items-center gap-2">
              <span onClick={(e)=>{e.stopPropagation();likePost(post?._id);console.log('clicked')}} className="material-icons text-xl cursor-pointer text-red-500">favorite</span>
              <span className="text-sm" >{post?.likes.length}</span>
            </div>
          </div>

          {/* PLAY / PAUSE / STOP BUTTONS */}
          <div className="flex items-center gap-2">

            {!isPlaying && !isPaused && audioComments?.length>0 && (
              <button
                onClick={handlePlayAll}
                className="bg-primary text-black px-3 py-2 rounded-full flex cursor-pointer items-center gap-2"
              >
                <span className="material-icons">play_arrow</span>
                <p className="text-xs">Play Comments</p>
              </button>
            )}

            {isPlaying && !isPaused && (
              <button
                onClick={handlePause}
                className="bg-yellow-300 text-black px-3 py-2 rounded-full flex items-center gap-2"
              >
                <span className="material-icons">pause</span>
                <p className="text-xs">Pause</p>
              </button>
            )}

            {isPaused && (
              <button
                onClick={handleResume}
                className="bg-green-400 text-black px-3 py-2 rounded-full flex items-center gap-2"
              >
                <span className="material-icons">play_arrow</span>
                <p className="text-xs">Resume</p>
              </button>
            )}

            {(isPlaying || isPaused) && (
              <button
                onClick={handleStop}
                className="bg-red-500 text-white px-3 py-2 rounded-full flex items-center gap-2"
              >
                <span className="material-icons">stop</span>
                <p className="text-xs">Stop</p>
              </button>
            )}
          </div>
        </div>

        {/* AUDIO COMMENTS */}
        {audioComments?.map((a, index) => (
           <Comments
            key={index}
            avatar={a.user.avatar}
            url={a.audio.url}
            name={a.user.name}
            duration={a.duration}
            isPlaying={currentIndex === index && isPlaying && !isPaused}
            isPaused={isPaused}
            onEnded={handleNext}
            comment={a}

          />
        ))}
        {!audioComments || audioComments?.length==0 && <p className="w-full bg-black p-2 mt-2 text-white text-xs"> No comments found </p>}
        <p className="text-xs text-gray-400">{audioComments?.length} comments</p>
      </div>
    </>
  );
}
