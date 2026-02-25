import { db, storage } from "../config/firebase.js";

/**
 * Add a new patient record (EndUser).
 */
export const createPatient = async (req, res) => {
  const { name, age, sex, complaints, scanType } = req.body;
  const createdBy = req.user.uid;

  try {
    const docRef = await db.collection("patients").add({
      name,
      age,
      sex,
      complaints,
      scanType,
      status: "To do", // Default status
      createdBy,
      pdfReportUrl: null, // Admin will upload this later
      zipFileUrl: null, // To be updated via uploadZip
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({ id: docRef.id, message: "Patient record created successfully." });
  } catch (error) {
    console.error("Create Patient Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch patients based on role.
 * EndUser: returns own patients.
 * Admin: returns all patients.
 */
export const getPatients = async (req, res) => {
  try {
    let query = db.collection("patients");

    // Role-based filtering
    if (req.user.role !== "admin") {
      query = query.where("createdBy", "==", req.user.uid);
    }

    const snapshot = await query.get();
    const patients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(patients);
  } catch (error) {
    console.error("Get Patients Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update patient status (Admin only).
 */
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.collection("patients").doc(id).update({
      status,
      updatedAt: new Date().toISOString()
    });

    res.json({ message: `Status updated to ${status}` });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Upload ZIP scan data (EndUser).
 * Sets a secure signed URL for the record.
 */
export const uploadZip = async (req, res) => {
  const { patientId } = req.body;
  const file = req.file;

  console.log("[uploadZip] patientId:", patientId);
  console.log("[uploadZip] file received:", file ? file.originalname : "NO FILE");
  console.log("[uploadZip] file size (bytes):", file ? file.buffer?.length : 0);

  if (!file) return res.status(400).json({ error: "No zip file provided." });
  if (!file.originalname.endsWith('.zip')) {
    return res.status(400).json({ error: "Only ZIP files are allowed for patient data." });
  }
  if (!patientId) {
    return res.status(400).json({ error: "patientId is required." });
  }

  try {
    const fileName = `patients/${patientId}/scans/${Date.now()}_${file.originalname}`;
    const blob = storage.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: "application/zip" }
    });

    blobStream.on("error", (err) => {
      console.error("[uploadZip] Stream error:", err.message);
      res.status(500).json({ error: err.message });
    });

    blobStream.on("finish", async () => {
      try {
        console.log("[uploadZip] Upload finished, generating signed URL...");
        const [url] = await blob.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 3600 * 1000  // 7 days
        });
        console.log("[uploadZip] Signed URL generated, updating Firestore...");

        await db.collection("patients").doc(patientId).update({
          zipFileUrl: url,
          updatedAt: new Date().toISOString()
        });

        console.log("[uploadZip] Firestore updated successfully.");
        res.status(200).json({ message: "Scan data uploaded successfully", url });
      } catch (err) {
        console.error("[uploadZip] Error after upload:", err.message);
        res.status(500).json({ error: err.message });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("[uploadZip] Top-level error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload Admin PDF Report.
 * Sets status to 'Completed'.
 */
export const uploadPdf = async (req, res) => {
  const { patientId } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No PDF file provided." });
  if (file.mimetype !== "application/pdf" && !file.originalname.endsWith('.pdf')) {
    return res.status(400).json({ error: "Only PDF files are allowed for reports." });
  }

  try {
    const fileName = `patients/${patientId}/reports/${Date.now()}_report.pdf`;
    const blob = storage.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: { contentType: "application/pdf" }
    });

    blobStream.on("error", (err) => res.status(500).json({ error: err.message }));

    blobStream.on("finish", async () => {
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 3600 * 1000 // 1 year
      });

      await db.collection("patients").doc(patientId).update({
        pdfReportUrl: url,
        status: "Completed",
        updatedAt: new Date().toISOString()
      });

      res.status(200).json({ message: "Admin report uploaded and status completed.", url });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
