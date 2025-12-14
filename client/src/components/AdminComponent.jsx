import { AuthContext } from "../context/AuthContext"; 
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import OptionModal from "./OptionModal";

export default function AdminComponent() {
  const { allUsers, deleteUser, toggleVerifyUser } = useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [action, setAction] = useState(null); // "delete" | "verify"
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!userId || !action) return;

    if (action === "delete") {
      await deleteUser(userId);
    }

    if (action === "verify") {
      await toggleVerifyUser(userId);
    }

    setModal(false);
    setAction(null);
    setUserId(null);
  };

  return (
    <div className="w-full relative min-h-screen bg-white">
      {modal && (
        <OptionModal
          isOpen={modal}
          title={title}
          message={message}
          onConfirm={handleConfirm}
          onCancel={() => setModal(false)}
        />
      )}

      {/* Users Count */}
      <div className="w-full bg-[#eee] py-4 text-center text-xl md:text-2xl font-medium">
        {allUsers?.length} users
      </div>

      {/* User List */}
      <div className="px-4 md:px-8">
        {allUsers?.map((u, index) => (
          <div
            key={index}
            onClick={() => navigate(`/profile/${u?._id}`)}
            className="w-full p-2 border-primary cursor-pointer"
          >
            <div className="flex md:flex-row md:items-center md:justify-between py-6 gap-4">

              {/* Avatar + Name */}
              <div className="flex items-center gap-4 md:gap-6">
                <img
                  src={u.avatar}
                  alt="avatar"
                  className="w-12 aspect-square md:w-28 md:h-28 rounded-md object-cover"
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm md:text-4xl font-light">{u.name}</p>
                  {u.verified && (
                    <span className="material-icons text-primary">verified</span>
                  )}
                </div>
              </div>

              {/* Joined Date */}
              <p className="text-xs md:text-m ml-auto self-center font-light text-gray-600">
                joined {u?.createdAt.split("T")[0]}
              </p>

              {/* Options */}
              <details
                onClick={(e) => e.stopPropagation()}
                className="text-xs md:text-xl self-center cursor-pointer"
              >
                
                <summary onClick={(e) => e.stopPropagation()}>...</summary>

                <ul className="bg-gray-100 text-gray-400 text-xs divide-y-1">
                  <li
                    className="p-2 hover:bg-yellow-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal(true);
                      setTitle("Delete User");
                      setMessage("Do you want to delete this user?");
                      setAction("delete");
                      setUserId(u._id);
                    }}
                  >
                    Delete
                  </li>

                  <li
                    className="p-2 hover:bg-yellow-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal(true);
                      setTitle("Verify User");
                      setMessage("Do you want to verify this user?");
                      setAction("verify");
                      setUserId(u._id);
                    }}
                  >
                    {u?.verified?"Unverify":"verify"}
                  </li>
                </ul>
              </details>
            </div>

            <hr className="border-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
