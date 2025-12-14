import React, { useState, useRef,useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function FloatingMenu({ id = "floating-menu", items = [] }) {
  
  const menuRef = useRef(null);
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(`${id}:pos`);
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });

  const { posts } = useContext(AuthContext);

  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e) => {
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;

    offset.current = {
      x: startX - position.x,
      y: startY - position.y,
    };

    setDragging(true);
  };

  const onDrag = (e) => {
    if (!dragging) return;

    const moveX = e.clientX || e.touches?.[0]?.clientX;
    const moveY = e.clientY || e.touches?.[0]?.clientY;

    const newPos = {
      x: moveX - offset.current.x,
      y: moveY - offset.current.y,
    };

    setPosition(newPos);
    localStorage.setItem(`${id}:pos`, JSON.stringify(newPos));
  };

  const stopDrag = () => setDragging(false);

  return (
    
      <details 
      ref={menuRef}
      className="fixed min-w-30 bg-black  select-none cursor-move z-50 "
      style={{ left: position.x, top: position.y }}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onMouseMove={onDrag}
      onTouchMove={onDrag}
      onMouseUp={stopDrag}
      onTouchEnd={stopDrag}
      >
            <summary className=" text-xs text-white p-2">Notifications</summary>

            <ul className="bg-white text-gray-400 max-h-50 overflow-auto p-1 mt-2 divide-y-1">
             {posts?.map((post)=>{
              return (
                <>
                <li className=" text-xs p-2 ">
                You have {post?.likes.length} new likes 
              </li>
            
              <li className=" text-xs p-2 ">
                You have {post?.audioComments?.length} new comments 
              </li>

              <li className=" text-xs p-2 ">
                You have {post?.views} new views 
              </li>
             
                </>
              )
             })}
             <li className=" text-xs p-2 border-b-5 border-primary">
                You have {posts?.length} new posts 
              </li>
            </ul>

          </details>
      
  )
}