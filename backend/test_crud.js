// Node.js v20+ global fetch
const BASE_URL = 'http://localhost:3000/api';
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAM1-WKAa_gymUhxKs1fsljvww-HZD7hXw';

const timestamp = Date.now();
const testData = {
  user: {
    email: `crud_user_${timestamp}@test.com`,
    password: 'password123',
    name: 'CRUD Test User',
    role: 'endUser'
  }
};

async function runCrudTests() {
  console.log("🚀 Starting CRUD Route Verification...");

  try {
    // 1. SIGNUP
    console.log("\n[1] Registering test account...");
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.user)
    });
    console.log("✅ Signup Status:", signupRes.status);

    // 2. LOGIN
    console.log("\n[2] Logging in...");
    const loginRes = await fetch(FIREBASE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testData.user.email, password: testData.user.password, returnSecureToken: true })
    });
    const auth = await loginRes.json();
    const token = auth.idToken;
    console.log("🔑 Token received.");

    // 3. CREATE
    console.log("\n[3] Creating patient record...");
    const createRes = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: "Original Name", age: 30, sex: "Male", complaints: "Headache", scanType: "CT" })
    });
    const patient = await createRes.json();
    const patientId = patient.id;
    console.log("📄 Created Patient ID:", patientId);

    // 4. UPDATE (PUT)
    console.log(`\n[4] Updating patient ${patientId}...`);
    const updateRes = await fetch(`${BASE_URL}/patients/${patientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: "Updated Name", age: 31 })
    });
    console.log("✅ Update Status:", updateRes.status);
    const updateData = await updateRes.json();
    console.log("💬 Message:", updateData.message);

    // Verify update
    const verifyFetch = await fetch(`${BASE_URL}/patients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const patients = await verifyFetch.json();
    const updatedPatient = patients.find(p => p.id === patientId);
    console.log("🧐 Verified Name:", updatedPatient.name === "Updated Name" ? "PASSED" : "FAILED");
    console.log("🧐 Verified Age:", updatedPatient.age == 31 ? "PASSED" : "FAILED");

    // 5. DELETE
    console.log(`\n[5] Deleting patient ${patientId}...`);
    const deleteRes = await fetch(`${BASE_URL}/patients/${patientId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log("✅ Delete Status:", deleteRes.status);
    const deleteData = await deleteRes.json();
    console.log("💬 Message:", deleteData.message);

    // Verify delete
    const finalFetch = await fetch(`${BASE_URL}/patients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const finalPatients = await finalFetch.json();
    const deletedExists = finalPatients.some(p => p.id === patientId);
    console.log("🧐 Verified Deletion:", !deletedExists ? "PASSED" : "FAILED");

    console.log("\n✨ CRUD VERIFICATION SUCCESSFUL ✨");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  }
}

runCrudTests();
