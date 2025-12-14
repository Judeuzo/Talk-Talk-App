import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [posts,setPosts]= useState(null);
  const [allUsers,setAllUsers]= useState(null);


  // Set axios base URL to your backend
  const API = axios.create({
    baseURL: "http://localhost:8080/api",
  });

  // Attach token to every request
  API.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /* ===========================
        SIGN UP FUNCTION
  =========================== */
  const signup = async (name, email, password) => {
    try {
      const res = await API.post("/user/register", {
        name,
        email,
        password,
      });

      console.log("Registered:", res.data);
      toast.success(res.data.message);
      setUser(res.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return { success: true, data: res.data };
      
    } catch (err) {
        toast.error(err.response?.data?.message);
      return { success: false, error: err.response?.data?.message };
    }
  };

  /* ===========================
        LOGIN FUNCTION
  =========================== */
  const login = async (email, password) => {
    try {
      const res = await API.post("/user/login", { email, password });

      setUser(res.data.user);
      setToken(res.data.token);

      localStorage.setItem("token", res.data.token);

      setUser(res.data.user)
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message)
      console.log(localStorage.getItem("user"));
      return { success: true };
    } catch (err) {
        toast.error(err.response?.data?.message)
      return { success: false, error: err.response?.data?.message };
    }
  };

    /* ===========================
        UPDATE PROFILE FUNCTION
  =========================== */
  const profileUpdate = async (formData) => {
    try {

      const res = await API.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if(res.data.updatedUser){

        // Update authenticated user globally
      setUser(res.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(res.data.updatedUser));

      toast.success("Profile updated successfully!");

      return { success: true, data: res.data.updatedUser };

      }else{
        toast.error("something went wrong")
      }

      
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Update failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /* ===========================
        GET ALL USERS
  =========================== */

  const getAllUsers = async () => {
  try {
    const res = await API.get("/user/all");

    setAllUsers(res.data.users)

  } catch (err) {
    console.error("Get users error:", err);
    toast.error("Could not load users");
    return { success: false, users: [] };
  }
};



  /* ===========================
        LOGOUT FUNCTION
  =========================== */
  const logout = () => {

    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /* ===========================
      CREATE POST FUNCTION
=========================== */
const createPost = async (formData) => {
  try {
    const res = await API.post("/post/create", formData);

    toast.success("Post created successfully!");
    getAllPosts()
    return { success: true, data: res.data };
    
  } catch (err) {
    const message = err.response?.data?.message || "Failed to create post";
    toast.error(message);
    return { success: false, error: message };
  }
};

/* ===========================
      GET ALL POSTS FUNCTION
  =========================== */
  const getAllPosts = async () => {
    try {
      const res = await API.get("/post/all");

      setPosts(res.data.posts);
      

    } catch (err) {
      console.error("Get posts error:", err);
      toast.error("Could not load posts");
      return { success: false, posts: [] };
    }
  };

  /* ===========================
      DELETE POST FUNCTION
  =========================== */
  const deletePost = async (postId) => {
    try {
      const res = await API.delete(`/post/delete/${postId}`);

      if (res.data.success) {
        toast.success("Post deleted");
      } else {
        toast.error(res.data.message || "Failed to delete!");
      }

      return res.data;

    } catch (err) {
      console.error("Delete post error:", err);
      toast.error(err.response?.data?.message || "Could not delete post");
      return { success: false };
    }
  };

  /* ===========================
      LIKE / UNLIKE POST
=========================== */
const likePost = async (postId) => {
  try {
    const res = await API.put(`/post/like/${postId}`);

    if (res.data.success) {
      toast.success(res.data.message);

      // Refresh posts so UI updates immediately
      getAllPosts();
    } else {
      toast.error("Failed to like post");
    }
    
    return res.data.likes;

  } catch (err) {
    console.error("Like post error:", err);
    toast.error("Could not like post");
    return { success: false };
  }
};


  // -------------------------------
  // 🔥 SUBMIT AUDIO TO BACKEND 
  // -------------------------------
  const submitToBackend = async (formData,postId) => {
    try {

      const res = await API.post(`/audioComment/upload/${postId}`,formData);

      res.data?toast(res.data.message):null

      return res.data;

    } catch (error) {
      setLoading(false);
      console.error("Backend submission error:", error);
      throw error;
    }
  };

  // -------------------------------
  // 🔥 GET ALL AUDIO FOR POST
  // -------------------------------
  const getAudioComments = async (postId) => {
    try {

      const res = await API.get(`/audioComment/get/${postId}`);

      res.data?toast(res.data.message):null

      if(res){
        return res.data.comments
      }

    } catch (error) {
      setLoading(false);
      console.error("Backend submission error:", error);
      throw error;
    }
  };

  /////////////
  //////////// ADMIN FUNCTIONS
  ///////////

  /* ===========================
      DELETE USER (ADMIN)
=========================== */
const deleteUser = async (userId) => {
  try {
    const res = await API.delete(`/admin/delete-user/${userId}`);

    if (res.data.success) {
      toast.success(res.data.message || "User deleted successfully");

      // Remove deleted user from local state (optional but recommended)
      if (typeof setAllUsers === "function") {
        setAllUsers((prev) => prev.filter((u) => u._id !== userId));
      }

      return { success: true };
    } else {
      toast.error(res.data.message || "Failed to delete user");
      return { success: false };
    }
  } catch (err) {
    console.error("Delete user error:", err);
    toast.error(err.response?.data?.message || "Delete failed");
    return { success: false };
  }
};

// inside AuthProvider

/* ===========================
    TOGGLE USER VERIFICATION (ADMIN)
=========================== */
const toggleVerifyUser = async (userId) => {
  try {
    const res = await API.put(`/admin/verify-user/${userId}`);

    if (res.data.user) {
      toast.success(res.data.message);

      // Update user in allUsers state if exists
      if (allUsers) {
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userId ? { ...u, verified: res.data.user.verified } : u
          )
        );
      }

      return { success: true, user: res.data.user };
    } else {
      toast.error("Failed to update verification status");
      return { success: false };
    }
  } catch (err) {
    console.error("Toggle verify user error:", err);
    toast.error(err.response?.data?.message || "Could not update verification");
    return { success: false };
  }
};


  // Load user from localStorage on refresh
  useEffect(() => {
    getAllPosts()
    getAllUsers()
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signup,
        login,
        logout,
        loading,
        profileUpdate,
        createPost,
        getAllPosts,
        deletePost,
        posts,
        setPosts,
        submitToBackend,
        getAudioComments,
        getAllUsers,
        allUsers,
        likePost,
        deleteUser,
        toggleVerifyUser
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
