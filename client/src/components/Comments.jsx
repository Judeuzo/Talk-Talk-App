import React, { useState, useContext, useEffect, useRef } from "react";

const Comments = ({ avatar, name, duration, url, isPlaying, onEnded, comment }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleEnded = () => {
    onEnded && onEnded();
  };

  return (
    <div className={`md:p-20 p-4 mt-4 bg-primary ${!isPlaying && 'hidden'}`}>
      <div className="max-w-200 mx-auto bg-white rounded-xl p-4 flex items-center justify-between">

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-12 h-12 rounded-md object-cover"
          />
          <h2 className="md:text-lg text-sm md:font-semibold">{name}</h2>
          {comment.user.verified && <span class="material-icons text-primary">verified</span>}
        </div>

        {/* Animated Sound Wave — Only active when playing */}
        <div className="flex items-end gap-[3px] h-6">
          {[0,1,2,3,4,5].map((i) => (
            <span
              key={i}
              className={
                "wave-bar" +
                (isPlaying ? ` animation-delay-${i}` : " opacity-30")
              }
            />
          ))}
        </div>

        {/* AUDIO ELEMENT */}
        <audio
          ref={audioRef}
          src={url}
          onEnded={handleEnded}
        />

        {/* Duration */}
        <span className="text-sm font-medium">{duration}</span>
      </div>
    </div>
  );
};

export default Comments;
