import User from "../models/user.js";
import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//  User Registration

async function createUser(req, res) {
  try {
    // Log incoming payload for debugging
    // console.log("REQ BODY:", req.body);

    const { email, firstName, lastName, password } = req.body;

    // Input Validation
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        message: "Please provide firstName, lastName, email, and password",
      });
    }

    // Sanitize email
    const cleanEmail = email.trim().toLowerCase();

    // Check if a user with this email already exists in MongoDB
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash the password 
    const passwordHash = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      email: cleanEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: passwordHash,
    });

    
    await newUser.save();

    console.log("User created successfully:", newUser.email);

    
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error("Error Creating User:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}


// User Login 

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password",
      });
    }

    
    const cleanEmail = email.trim().toLowerCase();

  
    const user = await User.findOne({ email: cleanEmail });

    

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare the provided plain-text password against the stored bcrypt hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
    };

    // Sign the JWT — valid for 48 hours
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    console.log("User logged in successfully:", user.email);

    
    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Delete User Account

async function deleteUser(req, res) {
  try {
    const userId = req.user.id;
    

    // is user in database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    
    // delete all user Expenses and Categories
    await Promise.all([
      Expense.deleteMany({ userId }),
      Category.deleteMany({ userId }),
    ]);

  
    // delete
    await User.findByIdAndDelete(userId);

    console.log("User account and data deleted successfully:", user.email);

    return res.status(200).json({
      message: "User account and all associated data deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export { createUser, loginUser, deleteUser  };        