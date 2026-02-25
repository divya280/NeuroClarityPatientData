# NeuroClarity Patient Data Backend

A Firebase-powered backend for managing neuro-radiological patient data.

## Features
- **Firebase Auth**: Role-based authentication (admin/endUser).
- **Cloud Firestore**: Patient data management and status tracking.
- **Firebase Storage**: Secure file management for ZIP scans and PDF reports.

## Getting Started

### 1. Installation
Install the required dependencies:
```bash
npm install
```

### 2. Configuration
Update `src/firebase/firebaseConfig.js` with your own Firebase project credentials.

### 3. Running the Simulation
Execute the demonstration script:
```bash
npm start
```

## Project Structure
- `src/firebase/services/`: Core Firebase service functions.
- `src/examples.js`: Usage examples for different user roles.
- `src/main.js`: Entry point for the simulation.
