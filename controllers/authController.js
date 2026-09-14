import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ==========================================
// 1. User Registration Controller
// ==========================================
async function createUser(req, res) {
  try {
    // Log incoming payload for debugging
    console.log("REQ BODY:", req.body);

    const { email, firstName, lastName, password } = req.body;

    // 1. Input Validation: Check if all required fields are provided
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        message: "Please provide firstName, lastName, email, and password",
      });
    }

    // 2. Sanitize email input (trim whitespace and convert to lowercase)
    const cleanEmail = email.trim().toLowerCase();

    // 3. Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // 4. Asynchronously hash password (salt rounds = 10) for non-blocking I/O
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Instantiate new User document
    const newUser = new User({
      email: cleanEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: passwordHash,
    });

    // 6. Save user record to MongoDB database
    await newUser.save();

    console.log("User created successfully");

    // 7. HTTP 201 Created: Return success message and created user metadata
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

    // HTTP 500 Internal Server Error
    return res.status(500).json({
      message: "Error Creating User",
      error: err.message,
    });
  }
}

// ==========================================
// 2. User Login Controller
// ==========================================
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Input Validation: Check if email and password exist in body
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password",
      });
    }

    // 2. Sanitize email input
    const cleanEmail = email.trim().toLowerCase();

    // 3. Query database for matching user
    const user = await User.findOne({ email: cleanEmail });

    console.log("Fetched User Record:", user);

    // 4. Check if user exists (Uses return statement to prevent execution flow)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 5. Asynchronously compare plain password against stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // 6. Construct JWT Token Payload
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        Image: user.image || user.Image,
      };

      // 7. Sign JWT Token valid for 48 hours
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: "48h" }
      );

      console.log("User logged in successfully");

      // 8. HTTP 200 OK: Return access token and user display payload
      return res.status(200).json({
        message: "User logged in successfully",
        token: token,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });

    } else {
      // HTTP 401 Unauthorized: Password mismatch
      return res.status(401).json({
        message: "Invalid password",
      });
    }

  } catch (error) {
    console.error("Error logging in user:", error);

    // HTTP 500 Internal Server Error
    return res.status(500).json({
      message: "Error logging in user",
      error: error.message,
    });
  }
}

export { createUser, loginUser };