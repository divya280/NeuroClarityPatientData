import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "../../serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.warn("WARNING: serviceAccountKey.json not found! Firebase Admin might not work correctly.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "patientdata-cfbbe.firebasestorage.app"
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();

export default admin;
