# NeuroClarity Clinical Platform

NeuroClarity is a state-of-the-art medical data management system designed for neuro-radiological clinical workflows. It enables medical professionals to securely upload clinical scans (DICOM ZIP), track their analysis status, and download finalized PDF reports.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (Vanilla CSS modules), Lucide-react (Icons).
- **Backend**: Node.js, Express.
- **Database**: Google Cloud Firestore (NoSQL).
- **Authentication**: Firebase Authentication (Role-based).
- **Storage**: Firebase Storage (Secure file hosting).

## 📂 Project Structure

```bash
NeuroClarity/
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/     # AdminDashboard, UserDashboard
│   │   ├── context/        # AuthContext (Firebase logic)
│   │   ├── layout/         # Sidebar, Navbar, AppLayout
│   │   ├── pages/          # Home, Login, Signup, Profile, PatientForm
│   │   └── firebase.js     # Client SDK initialization
│   └── .env                # Client-side variables
└── backend/                # Node.js Express Server
    ├── src/
    │   ├── config/         # Firebase Admin SDK setup
    │   ├── controllers/    # Business logic (Auth, Patients)
    │   ├── middleware/     # Auth & Role verification
    │   ├── routes/         # Express API routing
    │   └── server.js       # Entry point
    └── serviceAccountKey.json # Firebase Admin credentials
```

## 🛠️ Execution Guide

### 1. Prerequisites
- Clone the repository
- Node.js (v18+)
- A Firebase Project with Firestore, Auth, and Storage enabled.
- Firebase **Service Account Key** (save as `backend/serviceAccountKey.json`).

### 2. Environment Variables
Create a `backend/serviceAccountKey.json` file:

Create a `frontend/.env` file:
```env
VITE_FIREBASE_API_KEY=AIzaSyAM1-WKAa_gymUhxKs1fsljvww-HZD7hXw
VITE_FIREBASE_AUTH_DOMAIN=patientdata-cfbbe.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=patientdata-cfbbe
VITE_FIREBASE_STORAGE_BUCKET=patientdata-cfbbe.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=83975107330
VITE_FIREBASE_APP_ID=1:83975107330:web:f5ce42470c197e30a7c81b
VITE_API_BASE_URL=http://localhost:3000/api

```

### 3. Running the App
Open two terminals:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Routes

### Authentication
- `POST /api/auth/signup`: Create a new user (admin/endUser).
- `GET /api/auth/me`: Get current authenticated user details.

### Patient Management
- `GET /api/patients`: Fetch records (filtered by user role).
- `POST /api/patients`: Create a new patient metadata record.
- `PUT /api/patients/:id`: Update patient metadata.
- `DELETE /api/patients/:id`: Remove record and associated files.
- `POST /api/patients/upload-zip`: Upload ZIP scan data.
- `PATCH /api/patients/:id/status`: Update case status (Admin only).
- `POST /api/patients/:patientId/upload-pdf`: Finalize and upload PDF report (Admin only).
---
Developed by **Divyashree V**
[LinkedIn Profile](https://www.linkedin.com/in/divyashree-v-1245a71b8/)
