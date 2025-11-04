// Signup and Login Controllers

// Import required modules
import cloudinay from "../lib/cloudinay.js"; // Import Cloudinary for image upload handling
import { generateToken } from "../lib/utils.js"; // Import function to generate JWT token for authentication
import User from "../models/User.js"; // Import the User model to interact with MongoDB users collection
import bcrypt from "bcryptjs"; // Import bcrypt to hash and compare passwords securely

// Signup a new user
export const signup = async (req, res) => {
  // Extract data from the request body
  const { fullName, email, password, bio } = req.body;

  try {
    // Check if all fields are provided
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // Generate a JWT token for the new user
    const token = generateToken(newUser._id);

    // Send success response
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    // Handle errors
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    // Extract email and password
    const { email, password } = req.body;

    // Find user by email
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate a new JWT token
    const token = generateToken(userData._id);

    // Send success response with user data
    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    // Handle errors
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  // Respond with user data if authentication successful
  res.json({ success: true, user: req.user });
};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    // Extract data from request body
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;

    // If profile picture not updated, only update bio and name
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      // Upload new profile picture to Cloudinary
      const upload = await cloudinay.uploader.upload(profilePic);

      // Update profile with new image URL
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    // Send success response
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    // Handle errors
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
