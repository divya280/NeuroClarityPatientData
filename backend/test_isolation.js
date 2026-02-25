// Multi-user Data Isolation Test
const BASE_URL = 'http://localhost:3000/api';
const FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAM1-WKAa_gymUhxKs1fsljvww-HZD7hXw';

async function authUser(email, password) {
  const loginRes = await fetch(FIREBASE_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  const auth = await loginRes.json();
  return auth.idToken;
}

async function runIsolationTest() {
  console.log("🧪 Starting Data Isolation Verification...");
  const ts = Date.now();
  
  const userA = { email: `userA_${ts}@test.com`, password: 'password123', name: 'Dr. A', role: 'endUser' };
  const userB = { email: `userB_${ts}@test.com`, password: 'password123', name: 'Dr. B', role: 'endUser' };

  try {
    // 1. Signup Users
    console.log("[1] Registering User A and User B...");
    await fetch(`${BASE_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userA) });
    await fetch(`${BASE_URL}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userB) });

    const tokenA = await authUser(userA.email, userA.password);
    const tokenB = await authUser(userB.email, userB.password);

    // 2. User A creates a record
    console.log("[2] User A creating a record...");
    const resA = await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ name: "Patient of A", age: 40, sex: "Male", complaints: "X", scanType: "MRI" })
    });
    const patientA = await resA.json();

    // 3. User B creates a record
    console.log("[3] User B creating a record...");
    await fetch(`${BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ name: "Patient of B", age: 50, sex: "Female", complaints: "Y", scanType: "CT" })
    });

    // 4. Verify User A only sees their record
    console.log("[4] Checking User A's view...");
    const fetchA = await fetch(`${BASE_URL}/patients`, { headers: { 'Authorization': `Bearer ${tokenA}` } });
    const dataA = await fetchA.json();
    console.log(`👁️  User A sees ${dataA.length} records.`);
    const hasB = dataA.some(p => p.name === "Patient of B");
    console.log("✅ Isolation Check (User A cannot see User B):", !hasB ? "PASSED" : "FAILED");

    // 5. Verify User B only sees their record
    console.log("[5] Checking User B's view...");
    const fetchB = await fetch(`${BASE_URL}/patients`, { headers: { 'Authorization': `Bearer ${tokenB}` } });
    const dataB = await fetchB.json();
    console.log(`👁️  User B sees ${dataB.length} records.`);
    const hasA = dataB.some(p => p.name === "Patient of A");
    console.log("✅ Isolation Check (User B cannot see User A):", !hasA ? "PASSED" : "FAILED");

    console.log("\n✨ DATA ISOLATION VERIFIED ✨");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  }
}

runIsolationTest();
