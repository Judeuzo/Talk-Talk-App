import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage.jsx";
import NewsFeed from "./pages/NewsFeed.jsx";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import LoginPage from "./pages/LoginPage.jsx";
import { Toaster } from "react-hot-toast";
import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import PostPage from "./pages/PostPage.jsx";
import FeedBackPage from "./pages/FeedBackPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { Analytics } from "@vercel/analytics/react";



function App() {

  const { user,loading } = useContext(AuthContext);

  // Protected Route component
const ProtectedRoute = ({ children }) => {
   if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      );
    }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

if (loading) {
    // global loading screen while checking token
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Analytics />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/newsfeed"
          element={
            <ProtectedRoute>
              <NewsFeed />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<ProtectedRoute><PostPage/></ProtectedRoute>} />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
          
        />
        <Route
          path="/feedBack"
          element={
            <ProtectedRoute>
              <FeedBackPage />
            </ProtectedRoute>
          }
          
        />

        {user?.admin && <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
          
        />}
      </Routes>
    </Router>
  );
}

export default App;
