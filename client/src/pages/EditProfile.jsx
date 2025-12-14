import { useState, useContext } from "react";
import Navbar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, setUser,profileUpdate } = useContext(AuthContext);

  const [openForm, setOpenForm] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  // This lets the user preview an image before uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // SEND FORM DATA TO BACKEND
  const handleSave = async (e) => {
    e.preventDefault();
    
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile); // actual file
      }

      profileUpdate(formData)

  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 bg-white shadow rounded-xl p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT – PROFILE IMAGE */}
          <div>
            <img
              src={avatarPreview}
              alt="Profile"
              className="rounded-xl w-full object-cover"
            />
          </div>

          {/* RIGHT – DETAILS */}
          <div className="flex flex-col space-y-2 justify-center">
            <h2 className="text-4xl font-semibold">{user?.name}</h2>

            <div className="w-full h-px bg-gray-300 my-4"></div>

            <h3 className="text-xl font-bold">Bio</h3>

            <p className="mt-2 text-gray-700 leading-relaxed">
              {user?.bio}
            </p>

            <button
              onClick={() => setOpenForm(true)}
              className="px-4 py-2 bg-primary hover:bg-yellow-200 cursor-pointer rounded-lg font-semibold"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ===================== EDIT FORM MODAL ===================== */}
      {openForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

            <form className="space-y-4" onSubmit={handleSave}>

              {/* PROFILE IMAGE UPLOAD */}
              <div>
                <label className="block font-medium mb-2">Profile Picture</label>

                <div className="flex items-center gap-4">
                  <img
                    src={avatarPreview}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium">Bio</label>
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-yellow-200 rounded-lg"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
