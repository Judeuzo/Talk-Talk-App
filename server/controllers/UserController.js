import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../cloudinary.js";

/* ================================
   REGISTER USER
================================ */

const genericAvatars = [ 
  "https://api.dicebear.com/7.x/avataaars/svg?seed=one",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=two",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=three",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=four",
];

const getRandomAvatar = () =>
  genericAvatars[Math.floor(Math.random() * genericAvatars.length)];


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already used" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: getRandomAvatar(), // ✅ random generic profile picture
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ message: "User registered", user,token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   LOGIN USER
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   UPDATE PROFILE
================================ */
export const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    let updateData = { name, bio };

    // If uploading a new profile picture
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "talktalk_profile_pics",
      });

      updateData.avatar = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    );

    

    res.json({
      message: "Profile updated",
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================================
   GET ALL USERS
================================ */
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users but exclude password for security
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
