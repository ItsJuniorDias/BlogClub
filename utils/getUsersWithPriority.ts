import { db } from "@/firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";

export const getUsersWithPriority = async (uid: string | undefined) => {
  const usersRef = collection(db, "users");

  const snapshot = await getDocs(usersRef);

  if (snapshot.empty) {
    console.log("No users found.");
    return [];
  }

  const users = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    users.push({ uid: doc.id, ...data });
  });

  users.sort((a, b) => {
    if (a.uid === uid) return -1;
    if (b.uid === uid) return 1;
    return 0;
  });

  return users;
};
