import admin from "firebase-admin";
import fs from "fs";

// Read JSON manually (safe for all Node versions)
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("../secrets/serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default db;