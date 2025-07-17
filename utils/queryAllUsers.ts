import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const queryAllUsers = async () => {
  const usersRef = collection(db, "users");

  const querySnapshotUsers = await getDocs(usersRef);

  const usersData = querySnapshotUsers.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return [...usersData];
};
