import { auth, db } from "../config/firebase.js";

/**
 * Middleware to verify Firebase ID Token.
 * Attaches decoded user and their Firestore profile data to req.user.
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Fetch detailed user profile from Firestore to get the 'role'
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      // If profile doesn't exist, we treat them as a base authenticated user
      req.user = { uid: decodedToken.uid, email: decodedToken.email, role: "endUser" };
    } else {
      req.user = { uid: decodedToken.uid, ...userDoc.data() };
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(403).json({ error: "Forbidden: Invalid token." });
  }
};

/**
 * Middleware to restrict routes to Admins only.
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
};
