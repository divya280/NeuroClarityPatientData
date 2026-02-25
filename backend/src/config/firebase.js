import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

// Check for Environment Variable first (Vercel/Production)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("Firebase initialized using environment variable.");
  } catch (error) {
    console.error("ERROR parsing FIREBASE_SERVICE_ACCOUNT env var:", error.message);
  }
}

// Fallback to local file
if (!serviceAccount) {
  const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    console.log("Firebase initialized using serviceAccountKey.json.");
  } else {
    console.warn("WARNING: Firebase Service Account not found! Admin features will fail.");
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "patientdata-cfbbe.firebasestorage.app"
  });
} else {
  console.error("CRITICAL: Firebase could not be initialized. Missing credentials.");
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();

export default admin;
