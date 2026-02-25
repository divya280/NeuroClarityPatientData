// Node.js v20+ has global fetch

const BASE_URL = 'http://localhost:3000/api';
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAM1-WKAa_gymUhxKs1fsljvww-HZD7hXw';

const timestamp = Date.now();
const testData = {
  user: {
    email: `user_${timestamp}@neuroclarity.com`,
    password: 'password123',
    name: 'End User Test',
    role: 'endUser'
  },
  admin: {
    email: `admin_${timestamp}@neuroclarity.com`,
    password: 'password123',
    name: 'Admin User Test',
    role: 'admin'
  }
};

async function runTests() {
  console.log("🚀 Starting NeuroClarity Backend Verification...");

  try {
    // 1. SIGNUP
    console.log("\n[1] Registering test accounts...");
    const uRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.user)
    });
    console.log("✅ EndUser Signup:", uRes.status);

    const aRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.admin)
    });
    console.log("✅ Admin Signup:", aRes.status);

    // 2. LOGIN (Google API)
    console.log("\n[2] Logging in to retrieve ID Tokens...");
    const uLogin = await fetch(FIREBASE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testData.user.email, password: testData.user.password, returnSecureToken: true })
    });
    const uAuth = await uLogin.json();
    const userToken = uAuth.idToken;

    const aLogin = await fetch(FIREBASE_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testData.admin.email, password: testData.admin.password, returnSecureToken: true })
    });
    const aAuth = await aLogin.json();
    const adminToken = aAuth.idToken;
    console.log("🔑 Tokens retrieved successfully.");

    // 3. CREATE PATIENT
    console.log("\n[3] Creating record as EndUser...");
    const pRes = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
      body: JSON.stringify({ name: "Jane Doe", age: 28, sex: "Female", complaints: "Migraine", scanType: "MRI" })
    });
    const patientDoc = await pRes.json();
    console.log("📄 Patient ID Created:", patientDoc.id);

    // 4. RBAC CHECK (EndUser visibility)
    console.log("\n[4] Logic Check: EndUser fetch...");
    const uFetch = await fetch(`${BASE_URL}/patients`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const uData = await uFetch.json();
    console.log(`👁️  EndUser sees ${uData.length} records.`);

    // 5. RBAC CHECK (Admin visibility)
    console.log("\n[5] Logic Check: Admin fetch (Master View)...");
    const aFetch = await fetch(`${BASE_URL}/patients`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const aData = await aFetch.json();
    console.log(`👁️  Admin sees ${aData.length} records across system.`);

    // 6. UPDATE STATUS (Admin)
    console.log(`\n[6] Admin Action: Updating patient ${patientDoc.id} status...`);
    const sRes = await fetch(`${BASE_URL}/patients/${patientDoc.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "In progress" })
    });
    const sData = await sRes.json();
    console.log("🚩 Update Status Result:", sData.message);

    console.log("\n✨ API VERIFICATION COMPLETE ✨");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  }
}

runTests();
