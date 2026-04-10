import db from "./firebaseAdmin.js";

const users = [
  {
    userId: "8089439833",
    name: "Your Name",
    phone: "8089439833",
    email: "", // fill in when setting up auth
    category: "INTERMEDIATE",
    role: "admin",
    active: true,
    joinedAt: new Date("2026-04-11"),
  },
];

async function seedUsers() {
  const batch = db.batch();
  users.forEach((user) => {
    const ref = db.collection("users").doc(user.userId);
    batch.set(ref, user, { merge: true });
  });
  await batch.commit();
  console.log("✅ Users seeded");
}

seedUsers();
