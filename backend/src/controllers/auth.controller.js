import { auth, db } from "../config/firebase.js";

/**
 * Sign up a new user and set their role in Firestore.
 */
export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // 1. Create Auth User
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create User Profile in Firestore
    const userProfile = {
      uid: user.uid,
      name,
      email,
      role: role === "admin" ? "admin" : "endUser",
      createdAt: new Date().toISOString()
    };

    await db.collection("users").doc(user.uid).set(userProfile);

    res.status(201).json({ message: "User created successfully", user: userProfile });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login Simulator.
 * In Firebase Hybrid apps, the client (React) logs in via Client SDK.
 * The backend verifies the session or provides initial data.
 */
export const login = (req, res) => {
  res.json({ message: "Login successful. Use your ID Token for subsequent requests.", user: req.user });
};

/**
 * Logout Simulator.
 * Stateless backend logout: The client side just discards the token.
 */
export const logout = (req, res) => {
  res.json({ message: "Logged out successfully (Client should clear token)." });
};

/**
 * Get current user data.
 */
export const me = (req, res) => {
  res.json(req.user);
};
